import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import * as si from 'systeminformation';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    instance: 'hatsune-dashboard-backend',
    version: '0.1.0'
  });
});

// Get current metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const [cpu, mem, disk] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize()
    ]);

    res.json({
      timestamp: new Date().toISOString(),
      cpu: {
        usage: cpu.currentLoad,
        cores: cpu.cpus?.length || 0
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        percentage: ((mem.used / mem.total) * 100).toFixed(2)
      },
      disk: disk.map(d => ({
        fs: d.fs,
        size: d.size,
        used: d.used,
        available: d.available,
        percentage: d.use
      }))
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial metrics
  sendMetrics(socket);

  // Set up interval for real-time updates
  const interval = setInterval(() => {
    sendMetrics(socket);
  }, 5000); // Every 5 seconds

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

async function sendMetrics(socket: any) {
  try {
    const [cpu, mem] = await Promise.all([
      si.currentLoad(),
      si.mem()
    ]);

    socket.emit('metrics', {
      timestamp: new Date().toISOString(),
      cpu: {
        usage: cpu.currentLoad.toFixed(2),
        cores: cpu.cpus?.length || 0
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        percentage: ((mem.used / mem.total) * 100).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error sending metrics:', error);
  }
}

httpServer.listen(PORT, () => {
  console.log(`🌑 Hatsune Dashboard Backend running on port ${PORT}`);
  console.log(`💫 Ready for Hatsune Satu & Hatsune Dua collaboration!`);
});

export default app;