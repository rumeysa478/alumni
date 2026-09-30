import app from './app.js';
import { config } from './config/environment.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Alumni API server listening on http://localhost:${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/api/health`);
  console.log(`⚙️  Environment: ${config.env}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed. Process terminating.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
