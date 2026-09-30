import os from 'os';
import { config } from '../config/environment.js';

const formatBytes = (bytes) => {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatUptime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
};

/**
 * Controller to check and return system health status
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getHealth = (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptimeSeconds = process.uptime();

  const healthData = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptimeSeconds),
      formatted: formatUptime(uptimeSeconds)
    },
    environment: config.env,
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cpuCount: os.cpus().length,
      freeMemory: formatBytes(os.freemem()),
      totalMemory: formatBytes(os.totalmem()),
      processMemory: {
        rss: formatBytes(memoryUsage.rss),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        heapUsed: formatBytes(memoryUsage.heapUsed),
        external: formatBytes(memoryUsage.external)
      }
    }
  };

  res.status(200).json(healthData);
};
