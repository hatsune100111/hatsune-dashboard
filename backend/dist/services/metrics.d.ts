import { SystemMetrics, NetworkMetrics } from '../types';
export declare class MetricsService {
    getCPUInfo(): Promise<{
        usage: number;
        cores: number;
        temperature?: number;
    }>;
    getMemoryInfo(): Promise<{
        total: number;
        used: number;
        free: number;
        percentage: string;
    }>;
    getDiskInfo(): Promise<Array<{
        fs: string;
        size: number;
        used: number;
        available: number;
        percentage: number;
    }>>;
    getNetworkInfo(): Promise<NetworkMetrics[]>;
    getSystemInfo(): Promise<{
        uptime: number;
        hostname: string;
        platform: string;
    }>;
    getAllMetrics(): Promise<SystemMetrics>;
}
export declare const metricsService: MetricsService;
//# sourceMappingURL=metrics.d.ts.map