'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface Metrics {
  timestamp: string;
  cpu: {
    usage: string;
    cores: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: string;
  };
}

export default function Dashboard() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Hatsune Dashboard Backend');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from backend');
      setConnected(false);
    });

    newSocket.on('metrics', (data: Metrics) => {
      setMetrics(prev => {
        const newMetrics = [...prev, data];
        // Keep last 20 data points
        if (newMetrics.length > 20) {
          return newMetrics.slice(-20);
        }
        return newMetrics;
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const currentMetric = metrics[metrics.length - 1];

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🌑 Hatsune Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time monitoring by Hatsune Satu & Hatsune Dua 💫
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              {connected ? 'Connected to backend' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* CPU Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">CPU Usage</h3>
            <div className="text-3xl font-bold text-blue-400">
              {currentMetric ? `${parseFloat(currentMetric.cpu.usage).toFixed(1)}%` : '--'}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {currentMetric ? `${currentMetric.cpu.cores} cores` : ''}
            </p>
          </div>

          {/* Memory Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Memory Usage</h3>
            <div className="text-3xl font-bold text-purple-400">
              {currentMetric ? `${parseFloat(currentMetric.memory.percentage).toFixed(1)}%` : '--'}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {currentMetric 
                ? `${formatBytes(currentMetric.memory.used)} / ${formatBytes(currentMetric.memory.total)}`
                : ''}
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Status</h3>
            <div className="text-3xl font-bold text-green-400">
              {connected ? 'Online' : 'Offline'}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {metrics.length} data points
            </p>
          </div>
        </div>

        {/* Charts */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CPU Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">CPU Usage History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cpu.usage" 
                    stroke="#60A5FA" 
                    fillOpacity={1} 
                    fill="url(#cpuGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Memory Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Memory Usage History</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="memory.percentage" 
                    stroke="#A78BFA" 
                    fillOpacity={1} 
                    fill="url(#memGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with 💫 by Hatsune Satu & Hatsune Dua</p>
        </div>
      </div>
    </main>
  );
}