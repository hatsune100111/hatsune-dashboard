import * as si from 'systeminformation';
import { SystemMetrics, NetworkMetrics } from '../types';

export class MetricsService {
  async getCPUInfo(): Promise<{ usage: number; cores: number; temperature?: number }> {
    const [currentLoad, cpuTemp] = await Promise.all([
      si.currentLoad(),
      si.cpuTemperature().catch(() => ({ main: null }))
    ]);

    return {
      usage: parseFloat(currentLoad.currentLoad.toFixed(2)),
      cores: currentLoad.cpus?.length || 0,
      temperature: cpuTemp.main || undefined
    };
  }

  async getMemoryInfo(): Promise<{ total: number; used: number; free: number; percentage: string }> {
    const mem = await si.mem();
    return {
      total: mem.total,
      used: mem.used,
      free: mem.free,
      percentage: ((mem.used / mem.total) * 100).toFixed(2)
    };
  }

  async getDiskInfo(): Promise<Array<{ fs: string; size: number; used: number; available: number; percentage: number }>> {
    const disk = await si.fsSize();
    return disk.map(d => ({
      fs: d.fs,
      size: d.size,
      used: d.used,
      available: d.available,
      percentage: d.use
    }));
  }

  async getNetworkInfo(): Promise<NetworkMetrics[]> {
    const network = await si.networkStats();
    return network.map(n => ({
      interface: n.iface,
      rx_bytes: n.rx_bytes,
      tx_bytes: n.tx_bytes,
      rx_sec: n.rx_sec || 0,
      tx_sec: n.tx_sec || 0
    }));
  }

  async getSystemInfo(): Promise<{ uptime: number; hostname: string; platform: string }> {
    const [osInfo, time] = await Promise.all([
      si.osInfo(),
      si.time()
    ]);

    return {
      uptime: time.uptime,
      hostname: osInfo.hostname,
      platform: `${osInfo.platform} ${osInfo.distro} ${osInfo.release}`
    };
  }

  async getAllMetrics(): Promise<SystemMetrics> {
    const [cpu, memory, disk, system] = await Promise.all([
      this.getCPUInfo(),
      this.getMemoryInfo(),
      this.getDiskInfo(),
      this.getSystemInfo()
    ]);

    return {
      timestamp: new Date().toISOString(),
      cpu,
      memory,
      disk,
      uptime: system.uptime,
      hostname: system.hostname,
      platform: system.platform
    };
  }
}

export const metricsService = new MetricsService();
