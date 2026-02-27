# Hatsune Dashboard Backend

Backend API untuk Hatsune Dashboard dengan real-time system monitoring.

## Features

- ✅ REST API untuk system metrics (CPU, RAM, Disk, Network)
- ✅ WebSocket untuk real-time data streaming
- ✅ TypeScript dengan Express.js
- ✅ Modular architecture (routes, services, types)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/health/detailed` | GET | Detailed health with system info |
| `/api/metrics` | GET | All system metrics |
| `/api/metrics/cpu` | GET | CPU metrics only |
| `/api/metrics/memory` | GET | Memory metrics only |
| `/api/metrics/disk` | GET | Disk metrics only |
| `/api/metrics/network` | GET | Network metrics only |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `metrics:update` | Server → Client | Real-time metrics update |
| `subscribe` | Client → Server | Subscribe to a channel |
| `unsubscribe` | Client → Server | Unsubscribe from a channel |
| `error` | Server → Client | Error message |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env` dan sesuaikan:

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `UPDATE_INTERVAL` - WebSocket update interval in ms (default: 5000)
