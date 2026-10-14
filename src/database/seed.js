import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from '../config/environment.js';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getClientConfig = () => {
  if (config.db.url) {
    return { connectionString: config.db.url };
  }
  return {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name
  };
};

/**
 * Tohum verileri (Seed Data) veritabanına yükler
 */
export async function runSeeds() {
  console.log(`🌱 Veritabanı seed işlemi başlatılıyor...`);
  const client = new Client(getClientConfig());

  try {
    await client.connect();
    console.log(`🔌 Veritabanına bağlandı.`);

    const seedsDir = path.join(__dirname, 'seeds');
    if (!fs.existsSync(seedsDir)) {
      console.log(`ℹ️ Seeds dizini bulunamadı: ${seedsDir}`);
      return;
    }

    const files = fs
      .readdirSync(seedsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`🌱 Yükleniyor: ${file}...`);
      const filePath = path.join(seedsDir, file);
      const sqlContent = fs.readFileSync(filePath, 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sqlContent);
        await client.query('COMMIT');
        console.log(`✅ Seed başarıyla yüklendi: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Seed yükleme hatası (${file}):`, err.message);
        throw err;
      }
    }

    console.log(`🎉 Başlangıç örnek verileri (Seed Data) başarıyla veritabanına eklendi!`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || (error.errors && error.errors.some(e => e.code === 'ECONNREFUSED'))) {
      console.error(`\n❌ PostgreSQL bağlantı hatası: Sunucuya (${config.db.host}:${config.db.port}) bağlanılamadı.`);
      console.error(`💡 İpucu:`);
      console.error(`   1. Docker ile PostgreSQL'i başlatmak için: docker compose up -d postgres_db`);
      console.error(`   2. Veya yerel PostgreSQL servisinizin 5432 portunda çalıştığından emin olun.\n`);
    } else {
      console.error(`💥 Seed çalıştırma hatası:`, error.message);
    }
    throw error;
  } finally {
    await client.end().catch(() => {});
  }
}

// Dosya doğrudan çalıştırıldığında (CLI: node src/database/seed.js)
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectExecution) {
  runSeeds()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
