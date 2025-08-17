const express = require('express');
const winston = require('winston');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Get dashboard overview
router.get('/overview', requireAuth, async (req, res) => {
  try {
    // Simulate dashboard metrics
    const overview = {
      securityScore: Math.floor(Math.random() * 20) + 80, // 80-100
      threatsDetected: Math.floor(Math.random() * 50) + 10,
      vulnerabilitiesFound: Math.floor(Math.random() * 100) + 20,
      complianceScore: Math.floor(Math.random() * 15) + 85,
      activeScans: Math.floor(Math.random() * 3),
      systemHealth: 'Good',
      lastScanTime: new Date().toISOString(),
      criticalAlerts: Math.floor(Math.random() * 5),
      recentActivity: [
        {
          id: 1,
          type: 'scan_completed',
          message: 'Vulnerability scan completed for 192.168.1.0/24',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'threat_detected',
          message: 'Brute force attack detected from 10.0.0.100',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: 'compliance_check',
          message: 'PCI-DSS compliance check completed - 89% score',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json({ overview });

  } catch (error) {
    logger.error('Dashboard overview failed:', error);
    res.status(500).json({
      error: 'Failed to get dashboard overview',
      code: 'DASHBOARD_ERROR'
    });
  }
});

// Get security metrics
router.get('/metrics', requireAuth, async (req, res) => {
  try {
    const metrics = {
      threatTrends: generateTrendData(30),
      vulnerabilityDistribution: {
        critical: Math.floor(Math.random() * 10) + 2,
        high: Math.floor(Math.random() * 20) + 5,
        medium: Math.floor(Math.random() * 30) + 10,
        low: Math.floor(Math.random() * 40) + 15
      },
      complianceStatus: {
        'PCI-DSS': Math.floor(Math.random() * 10) + 85,
        'GDPR': Math.floor(Math.random() * 10) + 80,
        'SOC2': Math.floor(Math.random() * 10) + 88,
        'HIPAA': Math.floor(Math.random() * 10) + 82
      },
      scanActivity: generateActivityData(7),
      topThreats: [
        { type: 'Brute Force Attack', count: Math.floor(Math.random() * 20) + 5 },
        { type: 'SQL Injection', count: Math.floor(Math.random() * 15) + 3 },
        { type: 'XSS Attack', count: Math.floor(Math.random() * 10) + 2 },
        { type: 'DDoS Pattern', count: Math.floor(Math.random() * 8) + 1 }
      ]
    };

    res.json({ metrics });

  } catch (error) {
    logger.error('Dashboard metrics failed:', error);
    res.status(500).json({
      error: 'Failed to get dashboard metrics',
      code: 'METRICS_ERROR'
    });
  }
});

function generateTrendData(days) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      threats: Math.floor(Math.random() * 20) + 5,
      vulnerabilities: Math.floor(Math.random() * 30) + 10,
      scans: Math.floor(Math.random() * 5) + 1
    });
  }
  return data;
}

function generateActivityData(days) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      scans: Math.floor(Math.random() * 10) + 2,
      alerts: Math.floor(Math.random() * 15) + 3
    });
  }
  return data;
}

module.exports = router;
