/**
 * @file src/middleware/logger.middleware.js
 * @description HTTP İstek Günlükleme Middleware'i (Logger Middleware)
 * Terminale her HTTP isteği tamamlandığında log satırı yazar:
 * Format: time method route restype duration
 * Örnek: 10:20:30 POST /user 201 18ms
 *
 * Hata durumlarında log kayıtlarını logs/error.logs dosyasına yazar.
 */

import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(process.cwd());
const logsDir = path.join(rootDir, 'logs');
const errorLogsFile = path.join(logsDir, 'error.logs');
const errorLogFile = path.join(logsDir, 'error.log');

/**
 * logs/error.logs ve logs/error.log dosyalarına hata logu ekler
 * @param {string|Object} entry - Log satırı veya nesnesi
 */
export const writeErrorLog = (entry) => {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const line = (typeof entry === 'string' ? entry : JSON.stringify(entry)).trim() + '\n';
    fs.appendFileSync(errorLogsFile, line, 'utf8');
    fs.appendFileSync(errorLogFile, line, 'utf8');
  } catch (err) {
    console.error('Hata log dosyasına yazılamadı:', err);
  }
};

export const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const now = new Date();
    const time = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0')
    ].join(':');

    const method = req.method;
    const route = req.originalUrl || req.url;
    const restype = res.statusCode;

    // Terminale çıktı yaz (Format: time method route restype duration)
    console.log(`${time} ${method} ${route} ${restype} ${duration}ms`);

    // 4xx ve 5xx hatalarını logs/error.logs dosyasına kaydet
    if (restype >= 400) {
      writeErrorLog(`${time} ${method} ${route} ${restype} ${duration}ms`);
    }
  });

  next();
};

export default loggerMiddleware;
