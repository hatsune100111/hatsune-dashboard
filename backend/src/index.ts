import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { metricsService } from './services/metrics';
import metricsRouter from './routes/metrics';
import healthRouter from './routes/health';

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
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || '5000');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/api/metrics', metricsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Hatsune Dashboard Backend',
    version: '0.1.0',
    description: 'Real-time system monitoring API',
    endpoints: {
      health: '/health',
      metrics: '/api/metrics',
      websocket: 'ws://localhost:' + PORT
    }
  });
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Send initial metrics
  emitMetrics(socket);

  // Handle subscription requests
  socket.on('subscribe', (channel: string) => {
    console.log(`📡 Client ${socket.id} subscribed to: ${channel}`);
    socket.join(channel);
  });

  socket.on('unsubscribe', (channel: string) => {
    console.log(`📡 Client ${socket.id} unsubscribed from: ${channel}`);
    socket.leave(channel);
  });

  // Set up interval for real-time updates
  const interval = setInterval(() => {
    emitMetrics(socket);
  }, UPDATE_INTERVAL);

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

async function emitMetrics(socket: any) {
  try {
    const metrics = await metricsService.getAllMetrics();
    
    // Emit to specific client
    socket.emit('metrics:update', metrics);
    
    // Also emit to 'metrics' room for broadcast subscriptions
    socket.to('metrics').emit('metrics:update', metrics);
  } catch (error) {
    console.error('❌ Error emitting metrics:', error);
    socket.emit('error', { message: 'Failed to fetch metrics' });
  }
}

// Start server
httpServer.listen(PORT, () => {
  console.log('🌑 Hatsune Dashboard Backend');
  console.log(`💫 Running on port ${PORT}`);
  console.log(`📊 Update interval: ${UPDATE_INTERVAL}ms`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Metrics API: http://localhost:${PORT}/api/metrics`);
  console.log('✨ Ready for Hatsune Satu & Hatsune Dua collaboration!');
});

export default app;
