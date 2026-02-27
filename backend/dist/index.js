"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const metrics_1 = require("./services/metrics");
const metrics_2 = __importDefault(require("./routes/metrics"));
const health_1 = __importDefault(require("./routes/health"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3001;
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || '5000');
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/health', health_1.default);
app.use('/api/metrics', metrics_2.default);
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
    socket.on('subscribe', (channel) => {
        console.log(`📡 Client ${socket.id} subscribed to: ${channel}`);
        socket.join(channel);
    });
    socket.on('unsubscribe', (channel) => {
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
async function emitMetrics(socket) {
    try {
        const metrics = await metrics_1.metricsService.getAllMetrics();
        // Emit to specific client
        socket.emit('metrics:update', metrics);
        // Also emit to 'metrics' room for broadcast subscriptions
        socket.to('metrics').emit('metrics:update', metrics);
    }
    catch (error) {
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
exports.default = app;
//# sourceMappingURL=index.js.map