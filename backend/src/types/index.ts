export interface CPUMetrics {
  usage: number;
  cores: number;
  temperature?: number;
}

export interface MemoryMetrics {
  total: number;
  used: number;
  free: number;
  percentage: string;
}

export interface DiskMetrics {
  fs: string;
  size: number;
  used: number;
  available: number;
  percentage: number;
}

export interface SystemMetrics {
  timestamp: string;
  cpu: CPUMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics[];
  uptime: number;
  hostname: string;
  platform: string;
}

export interface NetworkMetrics {
  interface: string;
  rx_bytes: number;
  tx_bytes: number;
  rx_sec: number;
  tx_sec: number;
}
