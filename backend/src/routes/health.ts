import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    instance: 'hatsune-dashboard-backend',
    version: '0.1.0',
    uptime: process.uptime()
  });
});

// Detailed health check with system info
router.get('/detailed', async (req, res) => {
  const osInfo = await import('systeminformation').then(si => si.osInfo());
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    instance: 'hatsune-dashboard-backend',
    version: '0.1.0',
    uptime: process.uptime(),
    nodeVersion: process.version,
    platform: osInfo.platform,
    hostname: osInfo.hostname
  });
});

export default router;
