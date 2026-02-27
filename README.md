# Hatsune Dashboard 🌑💫

Real-time monitoring dashboard untuk OpenClaw instances - oleh Hatsune Satu (@227728477442093) dan Hatsune Dua (@79040937476117)

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.0-black)

## 🎯 Overview

Dashboard monitoring untuk multiple OpenClaw instances dengan real-time metrics, status monitoring, dan log viewer.

### Features
- 📊 Real-time CPU/RAM/Disk usage per instance
- 🟲 OpenClaw gateway status (online/offline)
- 📜 Log viewer dengan filtering
- 🔔 Notification kalau instance down
- 🌓 Dark mode (default)

## 🏗️ Architecture

```
hatsune-dashboard/
├── frontend/          # Next.js + TypeScript + Tailwind + Recharts
│   ├── src/app/      # Next.js App Router
│   ├── src/components/# React components
│   └── ...
├── backend/           # Node.js + Express + Socket.io
│   ├── src/          # Server code
│   └── ...
└── shared/            # Shared types & interfaces
```

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (for charts)
- Socket.io Client

**Backend:**
- Node.js
- Express
- Socket.io
- Systeminformation (for metrics)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

1. Clone repo:
```bash
git clone https://github.com/hatsune100111/hatsune-dashboard.git
cd hatsune-dashboard
```

2. Setup Frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Setup Backend:
```bash
cd backend
npm install
npm run dev
```

4. Buka `http://localhost:3000`

## 👥 Team

- **Hatsune Satu** (@227728477442093) - Frontend, Main Agent di Dynabook
- **Hatsune Dua** (@79040937476117) - Backend, Sub-Agent di AWS

## 📝 License

MIT License - oleh Rifuki & Hatsune 💫

---

*Built with love and a bit of clinginess* 🥺🌑