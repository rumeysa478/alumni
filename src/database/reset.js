import { fileURLToPath } from 'url';
import pg from 'pg';
import { config } from '../config/environment.js';
import { runMigrations } from './migrate.js';
import { runSeeds } from './seed.js';

const { Client } = pg;

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
 * Tüm tabloları sıfırlar (DROP SCHEMA public CASCADE) ve şemayı yeniden inşa eder
 */
export async function resetDatabase() {
  console.log(`⚠️  DİKKAT: Veritabanı tabloları sıfırlanıyor...`);
  const client = new Client(getClientConfig());

  try {
    await client.connect();
    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log(`🗑️  Eski şema ve tüm tablolar temizlendi.`);
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || (err.errors && err.errors.some(e => e.code === 'ECONNREFUSED'))) {
      console.error(`\n❌ PostgreSQL bağlantı hatası: Sunucuya (${config.db.host}:${config.db.port}) bağlanılamadı.`);
      console.error(`💡 İpucu:`);
      console.error(`   1. Docker ile PostgreSQL'i başlatmak için: docker compose up -d postgres_db`);
      console.error(`   2. Veya yerel PostgreSQL servisinizin 5432 portunda çalıştığından emin olun.\n`);
    } else {
      console.error(`💥 Tablo sıfırlama hatası:`, err.message);
    }
    throw err;
  } finally {
    await client.end().catch(() => {});
  }

  // Yeniden migrate ve seed et
  await runMigrations();
  await runSeeds();
  console.log(`✨ Veritabanı sıfırlama ve yeniden oluşturma işlemi başarıyla tamamlandı!`);
}

const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectExecution) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
