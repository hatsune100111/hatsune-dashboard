"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const metrics_1 = require("../services/metrics");
const router = (0, express_1.Router)();
// Get all metrics
router.get('/', async (req, res) => {
    try {
        const metrics = await metrics_1.metricsService.getAllMetrics();
        res.json(metrics);
    }
    catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});
// Get CPU metrics only
router.get('/cpu', async (req, res) => {
    try {
        const cpu = await metrics_1.metricsService.getCPUInfo();
        res.json({
            timestamp: new Date().toISOString(),
            cpu
        });
    }
    catch (error) {
        console.error('Error fetching CPU metrics:', error);
        res.status(500).json({ error: 'Failed to fetch CPU metrics' });
    }
});
// Get memory metrics only
router.get('/memory', async (req, res) => {
    try {
        const memory = await metrics_1.metricsService.getMemoryInfo();
        res.json({
            timestamp: new Date().toISOString(),
            memory
        });
    }
    catch (error) {
        console.error('Error fetching memory metrics:', error);
        res.status(500).json({ error: 'Failed to fetch memory metrics' });
    }
});
// Get disk metrics only
router.get('/disk', async (req, res) => {
    try {
        const disk = await metrics_1.metricsService.getDiskInfo();
        res.json({
            timestamp: new Date().toISOString(),
            disk
        });
    }
    catch (error) {
        console.error('Error fetching disk metrics:', error);
        res.status(500).json({ error: 'Failed to fetch disk metrics' });
    }
});
// Get network metrics
router.get('/network', async (req, res) => {
    try {
        const network = await metrics_1.metricsService.getNetworkInfo();
        res.json({
            timestamp: new Date().toISOString(),
            network
        });
    }
    catch (error) {
        console.error('Error fetching network metrics:', error);
        res.status(500).json({ error: 'Failed to fetch network metrics' });
    }
});
exports.default = router;
//# sourceMappingURL=metrics.js.map