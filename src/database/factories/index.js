/**
 * @file src/database/factories/index.js
 * @description Tüm Factory'leri birleştiren ve CLI üzerinden zengin demo veri üreten modül
 */

import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from '../../config/environment.js';
import UserFactory from './user.factory.js';
import AnnouncementFactory from './announcement.factory.js';
import JobPostingFactory from './job.factory.js';

const { Client } = pg;

export { UserFactory, AnnouncementFactory, JobPostingFactory };

/**
 * Üretilen demo verileri PostgreSQL veritabanına kaydeder
 */
export async function seedDemoData({ userCount = 15, announcementCount = 8, jobCount = 6 } = {}) {
  console.log(`🏭 Factory Demo Veri Üretimi Başlatılıyor...`);
  console.log(`📊 Üretim Hedefleri: ${userCount} Kullanıcı/Mezun, ${announcementCount} Duyuru, ${jobCount} İş/Staj İlanı`);

  const mockUsers = UserFactory.createMany(userCount);
  const mockAnnouncements = AnnouncementFactory.createMany(announcementCount);
  const mockJobs = JobPostingFactory.createMany(jobCount);

  // PostgreSQL client
  const clientConfig = config.db.url
    ? { connectionString: config.db.url }
    : {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name
      };

  const client = new Client(clientConfig);

  try {
    await client.connect();
    console.log(`🔌 PostgreSQL bağlantısı kuruldu, demo veriler veritabanına aktarılıyor...`);

    await client.query('BEGIN');

    // 1. Kullanıcıları ve profilleri ekle
    for (const u of mockUsers) {
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, department, graduation_year, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [u.email, '$2a$10$demoHashedPasswordMock123456789', u.first_name, u.last_name, u.role, u.department, u.graduation_year, u.is_verified]
      );

      if (userRes.rows.length > 0 && u.profile) {
        const userId = userRes.rows[0].id;
        await client.query(
          `INSERT INTO alumni_profiles (user_id, current_company, current_title, city, country, linkedin_url, github_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (user_id) DO NOTHING`,
          [userId, u.profile.current_company, u.profile.current_title, u.profile.city, u.profile.country, u.profile.linkedin_url, u.profile.github_url]
        );
      }
    }
    console.log(`✅ ${mockUsers.length} adet demo kullanıcı ve profil kaydedildi.`);

    // 2. Duyuruları ekle
    for (const a of mockAnnouncements) {
      await client.query(
        `INSERT INTO announcements (title, content, category, author, target_audience, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [a.title, a.content, a.category, a.author, a.target_audience, a.is_active]
      );
    }
    console.log(`✅ ${mockAnnouncements.length} adet demo duyuru kaydedildi.`);

    // 3. İş ilanlarını ekle
    for (const j of mockJobs) {
      await client.query(
        `INSERT INTO job_postings (title, company, description, location, type, deadline, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [j.title, j.company, j.description, j.location, j.type, j.deadline, j.is_active]
      );
    }
    console.log(`✅ ${mockJobs.length} adet demo iş/staj ilanı kaydedildi.`);

    await client.query('COMMIT');
    console.log(`🎉 TÜM DEMO VERİLER BAŞARIYLA ÜRETİLDİ VE VERİTABANINA YÜKLENDİ!`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    if (error.code === 'ECONNREFUSED' || (error.errors && error.errors.some(e => e.code === 'ECONNREFUSED'))) {
      console.warn(`\n⚠️  PostgreSQL sunucusuna erişilemedi (${config.db.host}:${config.db.port}).`);
      console.log(`💡 Demo veriler üretildi (Örnek çıktı aşağıdadır). Canlı veritabanına yazmak için önce 'docker compose up -d postgres_db' komutunu çalıştırabilirsiniz.\n`);
      console.log(`Örnek üretilen ilk 3 kullanıcı:`);
      console.dir(mockUsers.slice(0, 3), { depth: null });
    } else {
      console.error(`💥 Demo veri üretim hatası:`, error.message);
    }
  } finally {
    await client.end().catch(() => {});
  }
}

const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectExecution) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
