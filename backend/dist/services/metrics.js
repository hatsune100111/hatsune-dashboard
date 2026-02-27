"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsService = exports.MetricsService = void 0;
const si = __importStar(require("systeminformation"));
class MetricsService {
    async getCPUInfo() {
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
    async getMemoryInfo() {
        const mem = await si.mem();
        return {
            total: mem.total,
            used: mem.used,
            free: mem.free,
            percentage: ((mem.used / mem.total) * 100).toFixed(2)
        };
    }
    async getDiskInfo() {
        const disk = await si.fsSize();
        return disk.map(d => ({
            fs: d.fs,
            size: d.size,
            used: d.used,
            available: d.available,
            percentage: d.use
        }));
    }
    async getNetworkInfo() {
        const network = await si.networkStats();
        return network.map(n => ({
            interface: n.iface,
            rx_bytes: n.rx_bytes,
            tx_bytes: n.tx_bytes,
            rx_sec: n.rx_sec || 0,
            tx_sec: n.tx_sec || 0
        }));
    }
    async getSystemInfo() {
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
    async getAllMetrics() {
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
exports.MetricsService = MetricsService;
exports.metricsService = new MetricsService();
//# sourceMappingURL=metrics.js.map