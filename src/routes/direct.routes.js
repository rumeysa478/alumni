/**
 * @file src/routes/direct.routes.js
 * @description Doğrudan ve Genel Rotalar (Direct Routes: /, /about, /hello, /sum, /health)
 * @author Rumeysa Aydın
 */

import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const directRouter = Router();

/**
 * GET / - Ana Sayfa
 */
directRouter.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.sendFile(path.join(rootDir, 'public', 'index.html'));
  }
  res.status(200).json({
    message: 'Alumni Tracking System API is running',
    version: '1.0.0',
    developer: 'Rumeysa Aydın',
    pages: {
      users: '/users',
      announcements: '/announcements',
      jobs: '/jobs',
      applications: '/applications',
      events: '/events'
    },
    apiDocs: '/api/swagger',
    healthCheck: '/api/health'
  });
});

/**
 * GET /about - Proje Hakkında Sayfası
 */
directRouter.get('/about', (req, res) => {
  res.sendFile(path.join(rootDir, 'public', 'about.html'));
});

/**
 * GET /hello - Temel Selamlama Rotası
 */
directRouter.get('/hello', (req, res) => {
  res.send('Hello World');
});

/**
 * GET /hello/:name - Parametrik Selamlama Rotası
 */
directRouter.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  res.send(`Hello ${formattedName}!`);
});

/**
 * GET /sum/:number1/:number2 - Toplama İşlemi Rotası
 */
directRouter.get('/sum/:number1/:number2', (req, res) => {
  const num1 = Number(req.params.number1);
  const num2 = Number(req.params.number2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Lütfen geçerli sayılar giriniz');
  }

  const sum = num1 + num2;
  res.send(`toplam= ${sum}`);
});

/**
 * GET /health - Doğrudan Sağlık Kontrolü Rotası
 */
directRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default directRouter;
