import express from 'express';
import path from 'path';
import cors from 'cors';
import methodOverride from 'method-override';
import { fileURLToPath, pathToFileURL } from 'url';
import apiRouter from './src/routes/index.js';
import userRoutes from './src/routes/user.routes.js';
import announcementRoutes from './src/routes/announcement.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'src', 'views')
]);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// GET / - Temporary main page (or JSON for API clients)
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.status(200).json({
    message: 'Alumni Tracking System API is running',
    usersPage: '/users',
    announcementsPage: '/announcements',
    healthCheck: '/api/health',
    swaggerDocs: '/api/swagger'
  });
});

// GET /about - Temporary about page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// GET /hello - Returns Hello World
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

// GET /hello/:name - Returns Hello <Name>!
app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  res.send(`Hello ${formattedName}!`);
});

// GET /sum/:number1/:number2 - Returns sum of two numbers
app.get('/sum/:number1/:number2', (req, res) => {
  const num1 = Number(req.params.number1);
  const num2 = Number(req.params.number2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Lütfen geçerli sayılar giriniz');
  }

  const sum = num1 + num2;
  res.send(`toplam= ${sum}`);
});

// Mount MVC View Routes for Users at /users
app.use('/users', userRoutes);

// Mount MVC View Routes for Announcements at /announcements
app.use('/announcements', announcementRoutes);

// Mount modular API Routes at /api
app.use('/api', apiRouter);

// Start server only when executed directly (not when imported in tests)
const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`🚀 Alumni Web & API server listening on http://localhost:${PORT}`);
    console.log(`👥 Users (MVC View): http://localhost:${PORT}/users`);
    console.log(`📢 Announcements (MVC View): http://localhost:${PORT}/announcements`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api/swagger`);
  });
}

export default app;
