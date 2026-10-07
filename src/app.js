import express from 'express';
import path from 'path';
import cors from 'cors';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import userRoutes from './routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', [
  path.join(rootDir, 'views'),
  path.join(__dirname, 'views')
]);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(rootDir, 'public')));

// Root welcome route
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.sendFile(path.join(rootDir, 'public', 'index.html'));
  }
  res.status(200).json({
    message: 'Alumni Tracking System API is running',
    usersPage: '/users',
    healthCheck: '/api/health',
    swaggerDocs: '/api/swagger'
  });
});

// Mount MVC View Routes for Users at /users
app.use('/users', userRoutes);

// API Routes
app.use('/api', apiRouter);

// 404 Handler
app.use((req, res) => {
  if (req.accepts('html')) {
    return res.status(404).render('error', {
      title: 'Sayfa Bulunamadı (404)',
      message: `Aradığınız '${req.originalUrl}' sayfası bulunamadı.`
    });
  }
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  if (req.accepts('html')) {
    return res.status(err.status || 500).render('error', {
      title: 'Sunucu Hatası (500)',
      message: err.message || 'Beklenmeyen bir hata oluştu.'
    });
  }
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

export default app;
