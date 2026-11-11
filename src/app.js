import express from 'express';
import path from 'path';
import cors from 'cors';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import { loggerMiddleware, notFoundGuardian, serverErrorGuardian } from './middleware/index.js';
import directRouter from './routes/direct.routes.js';
import apiRouter from './routes/index.js';
import userRoutes from './routes/user.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import jobRoutes from './routes/job.routes.js';
import applicationRoutes from './routes/application.routes.js';
import eventRoutes from './routes/event.routes.js';

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
app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(rootDir, 'public')));

// 1. Mount Direct & Informational Routes (/, /about, /hello, /sum, /health)
app.use('/', directRouter);

// 2. Mount MVC Web Resource Routes
app.use('/users', userRoutes);
app.use('/announcements', announcementRoutes);
app.use('/jobs', jobRoutes);
app.use('/applications', applicationRoutes);
app.use('/events', eventRoutes);

// 3. Mount Central REST API Router at /api
app.use('/api', apiRouter);

// 4. 404 Guardian Middleware (Bulunamayan rotalar ve kaynaklar)
app.use(notFoundGuardian);

// 5. 5xx Guardian Middleware (Sunucu tarafı hatalar)
app.use(serverErrorGuardian);

export default app;
