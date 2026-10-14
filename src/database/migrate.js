import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from '../config/environment.js';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getClientConfig = (databaseName) => {
  if (config.db.url) {
    if (databaseName) {
      const url = new URL(config.db.url);
      url.pathname = `/${databaseName}`;
      return { connectionString: url.toString() };
    }
    return { connectionString: config.db.url };
  }
  return {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: databaseName || config.db.name
  };
};

/**
 * Hedef veritabanının var olduğunu doğrular, yoksa 'postgres' sunucusuna bağlanıp oluşturur.
 */
async function ensureDatabaseExists() {
  const targetDb = config.db.name;
  const adminClient = new Client(getClientConfig('postgres'));

  try {
    await adminClient.connect();
    const checkDb = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDb]
    );

    if (checkDb.rowCount === 0) {
      console.log(`🔨 Veritabanı '${targetDb}' bulunamadı, oluşturuluyor...`);
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`✅ Veritabanı '${targetDb}' başarıyla oluşturuldu.`);
    }
  } catch (err) {
    // postgres bağlantısı başarısız olursa (örneğin kullanıcı izni yoksa) devam etmeyi dene
    console.warn(`⚠️ Veritabanı varlık kontrolü uyarısı: ${err.message}`);
  } finally {
    await adminClient.end().catch(() => {});
  }
}

/**
 * Migration koşucusu ana fonksiyonu
 */
export async function runMigrations() {
  console.log(`🚀 Veritabanı migration işlemi başlatılıyor...`);
  console.log(`📡 Hedef Sunucu: ${config.db.host}:${config.db.port} | Veritabanı: ${config.db.name}`);

  await ensureDatabaseExists();

  const client = new Client(getClientConfig());

  try {
    await client.connect();
    console.log(`🔌 Veritabanına başarıyla bağlanıldı.`);

    // 1. _migrations takip tablosunu oluştur
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Halihazırda uygulanmış migration'ları al
    const { rows: appliedRows } = await client.query(`SELECT name FROM _migrations`);
    const appliedSet = new Set(appliedRows.map(r => r.name));

    // 3. migrations dizinindeki .sql dosyalarını oku
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log(`ℹ️ Migrations dizini bulunamadı: ${migrationsDir}`);
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`⏭️  Atlandı (Zaten uygulanmış): ${file}`);
        continue;
      }

      console.log(`⚡ Uygulanıyor: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sqlContent);
        await client.query(`INSERT INTO _migrations (name) VALUES ($1)`, [file]);
        await client.query('COMMIT');
        console.log(`✅ Başarıyla tamamlandı: ${file}`);
        appliedCount++;
      } catch (migrationErr) {
        await client.query('ROLLBACK');
        console.error(`❌ Hata (${file}):`, migrationErr.message);
        throw migrationErr;
      }
    }

    if (appliedCount === 0) {
      console.log(`✨ Tüm migration'lar güncel. Uygulanacak yeni şema bulunamadı.`);
    } else {
      console.log(`🎉 Toplam ${appliedCount} adet migration başarıyla veritabanına uygulandı!`);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || (error.errors && error.errors.some(e => e.code === 'ECONNREFUSED'))) {
      console.error(`\n❌ PostgreSQL bağlantı hatası: Sunucuya (${config.db.host}:${config.db.port}) bağlanılamadı.`);
      console.error(`💡 İpucu:`);
      console.error(`   1. Docker ile PostgreSQL'i başlatmak için: docker compose up -d postgres_db`);
      console.error(`   2. Veya yerel PostgreSQL servisinizin 5432 portunda çalıştığından emin olun.`);
      console.error(`   3. '.env' dosyanızdaki DB_HOST, DB_PORT, DB_USER ve DB_PASSWORD ayarlarını kontrol edin.\n`);
    } else {
      console.error(`💥 Migration çalıştırma hatası:`, error.message);
    }
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

// Dosya doğrudan çalıştırıldığında (CLI: node src/database/migrate.js)
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectExecution) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
