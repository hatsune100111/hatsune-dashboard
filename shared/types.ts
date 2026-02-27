// Shared types for Hatsune Dashboard

export interface SystemMetrics {
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
  disk?: {
    fs: string;
    size: number;
    used: number;
    available: number;
    percentage: number;
  }[];
}

export interface Instance {
  id: string;
  name: string;
  host: string;
  location: string; // 'Dynabook' | 'AWS' | etc
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  metrics?: SystemMetrics;
}

export interface DashboardState {
  instances: Instance[];
  globalStatus: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}