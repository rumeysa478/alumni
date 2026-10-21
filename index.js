import { fileURLToPath, pathToFileURL } from 'url';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

// Start server only when executed directly (not when imported in tests)
const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`🚀 Alumni Web & API server listening on http://localhost:${PORT}`);
    console.log(`👥 Users (MVC View): http://localhost:${PORT}/users`);
    console.log(`📢 Announcements (MVC View): http://localhost:${PORT}/announcements`);
    console.log(`💼 Jobs (MVC View): http://localhost:${PORT}/jobs`);
    console.log(`📅 Events (MVC View): http://localhost:${PORT}/events`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📚 Swagger docs: http://localhost:${PORT}/api/swagger`);
  });
}

export default app;
