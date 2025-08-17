const express = require('express');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const VulnerabilityScanner = require('../services/vulnerabilityScanner');
const { requireAuth, requireAnalyst } = require('../middleware/auth');

const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Initialize vulnerability scanner
const scanner = new VulnerabilityScanner();

// Input validation for scan requests
const validateScanRequest = [
  body('targets')
    .isArray({ min: 1 })
    .withMessage('At least one target is required'),
  body('targets.*')
    .matches(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
    .withMessage('Invalid IP address or hostname format'),
  body('ports')
    .optional()
    .matches(/^(\d+(-\d+)?,)*\d+(-\d+)?$/)
    .withMessage('Invalid port format'),
  body('scanType')
    .optional()
    .isIn(['quick', 'full', 'stealth', 'aggressive'])
    .withMessage('Invalid scan type'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Scan name must be 1-100 characters')
];

// Start new vulnerability scan
router.post('/start', requireAnalyst, validateScanRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { targets, ports, scanType = 'full', name } = req.body;
    const userId = req.user.id;

    logger.info('Starting vulnerability scan', {
      userId,
      targets,
      scanType,
      ports: ports?.length || 'default'
    });

    // Prepare scan options
    const scanOptions = {
      scanType,
      userId,
      name: name || `Scan ${new Date().toISOString()}`,
      requestedBy: req.user.name || req.user.email
    };

    if (ports) {
      scanOptions.ports = ports.split(',').map(p => parseInt(p.trim()));
    }

    // Start the scan
    const scanResults = await scanner.performNetworkScan(targets, scanOptions);

    res.json({
      message: 'Vulnerability scan started successfully',
      scan: {
        scanId: scanResults.scanId,
        targets: scanResults.targets,
        status: scanResults.status,
        startTime: scanResults.startTime,
        estimatedDuration: calculateEstimatedDuration(targets.length, scanType)
      }
    });

  } catch (error) {
    logger.error('Scan start failed:', error);
    res.status(500).json({
      error: 'Failed to start scan',
      code: 'SCAN_START_ERROR',
      message: error.message
    });
  }
});

// Get scan results
router.get('/results/:scanId', requireAuth, async (req, res) => {
  try {
    const { scanId } = req.params;
    const scanResults = scanner.getScanResults(scanId);

    if (!scanResults) {
      return res.status(404).json({
        error: 'Scan not found',
        code: 'SCAN_NOT_FOUND'
      });
    }

    // Check if user has permission to view this scan
    if (req.user.role !== 'admin' && scanResults.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    res.json({
      scan: scanResults
    });

  } catch (error) {
    logger.error('Failed to get scan results:', error);
    res.status(500).json({
      error: 'Failed to get scan results',
      code: 'SCAN_RESULTS_ERROR'
    });
  }
});

// Get all scans for current user
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, scanType } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let allScans = scanner.getAllScans();

    // Filter scans based on user role
    if (userRole !== 'admin') {
      allScans = allScans.filter(scan => scan.userId === userId);
    }

    // Apply filters
    if (status) {
      allScans = allScans.filter(scan => scan.status === status);
    }

    if (scanType) {
      allScans = allScans.filter(scan => scan.scanType === scanType);
    }

    // Sort by start time (newest first)
    allScans.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const scans = allScans.slice(startIndex, endIndex);

    // Generate summary for each scan
    const scanSummaries = scans.map(scan => ({
      scanId: scan.scanId,
      name: scan.name || 'Unnamed Scan',
      status: scan.status,
      startTime: scan.startTime,
      endTime: scan.endTime,
      duration: scan.duration,
      targets: scan.targets,
      summary: scan.summary,
      vulnerabilitiesFound: scan.vulnerabilities?.length || 0,
      criticalVulns: scan.vulnerabilities?.filter(v => v.severity === 'CRITICAL').length || 0,
      highVulns: scan.vulnerabilities?.filter(v => v.severity === 'HIGH').length || 0
    }));

    res.json({
      scans: scanSummaries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(allScans.length / limit),
        totalScans: allScans.length,
        hasNext: endIndex < allScans.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    logger.error('Failed to get scan history:', error);
    res.status(500).json({
      error: 'Failed to get scan history',
      code: 'SCAN_HISTORY_ERROR'
    });
  }
});

// Get scan statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let allScans = scanner.getAllScans();

    // Filter scans based on user role
    if (userRole !== 'admin') {
      allScans = allScans.filter(scan => scan.userId === userId);
    }

    // Filter by time period
    const now = new Date();
    let cutoffDate;
    
    switch (period) {
      case '7d':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const recentScans = allScans.filter(scan => 
      new Date(scan.startTime) >= cutoffDate
    );

    // Calculate statistics
    const stats = {
      totalScans: recentScans.length,
      completedScans: recentScans.filter(s => s.status === 'completed').length,
      runningScans: recentScans.filter(s => s.status === 'running').length,
      failedScans: recentScans.filter(s => s.status === 'failed').length,
      totalHosts: recentScans.reduce((sum, s) => sum + (s.summary?.hostsScanned || 0), 0),
      totalVulnerabilities: recentScans.reduce((sum, s) => sum + (s.vulnerabilities?.length || 0), 0),
      criticalVulnerabilities: recentScans.reduce((sum, s) => 
        sum + (s.vulnerabilities?.filter(v => v.severity === 'CRITICAL').length || 0), 0),
      highVulnerabilities: recentScans.reduce((sum, s) => 
        sum + (s.vulnerabilities?.filter(v => v.severity === 'HIGH').length || 0), 0),
      mediumVulnerabilities: recentScans.reduce((sum, s) => 
        sum + (s.vulnerabilities?.filter(v => v.severity === 'MEDIUM').length || 0), 0),
      averageScanDuration: calculateAverageDuration(recentScans.filter(s => s.duration)),
      scanTrends: calculateScanTrends(recentScans, period)
    };

    res.json({
      period,
      statistics: stats
    });

  } catch (error) {
    logger.error('Failed to get scan statistics:', error);
    res.status(500).json({
      error: 'Failed to get scan statistics',
      code: 'SCAN_STATS_ERROR'
    });
  }
});

// Cancel running scan
router.post('/cancel/:scanId', requireAnalyst, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    const scanResults = scanner.getScanResults(scanId);
    
    if (!scanResults) {
      return res.status(404).json({
        error: 'Scan not found',
        code: 'SCAN_NOT_FOUND'
      });
    }

    // Check if user has permission to cancel this scan
    if (req.user.role !== 'admin' && scanResults.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    if (scanResults.status !== 'running') {
      return res.status(400).json({
        error: 'Scan is not running',
        code: 'SCAN_NOT_RUNNING'
      });
    }

    // Cancel the scan
    scanner.cancelScan(scanId);

    logger.info('Scan cancelled', {
      scanId,
      userId,
      cancelledBy: req.user.name || req.user.email
    });

    res.json({
      message: 'Scan cancelled successfully',
      scanId
    });

  } catch (error) {
    logger.error('Failed to cancel scan:', error);
    res.status(500).json({
      error: 'Failed to cancel scan',
      code: 'SCAN_CANCEL_ERROR'
    });
  }
});

// Export scan results
router.get('/export/:scanId', requireAuth, async (req, res) => {
  try {
    const { scanId } = req.params;
    const { format = 'json' } = req.query;

    const scanResults = scanner.getScanResults(scanId);
    
    if (!scanResults) {
      return res.status(404).json({
        error: 'Scan not found',
        code: 'SCAN_NOT_FOUND'
      });
    }

    // Check if user has permission to export this scan
    if (req.user.role !== 'admin' && scanResults.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    switch (format.toLowerCase()) {
      case 'csv':
        const csvData = convertToCSV(scanResults);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.csv"`);
        res.send(csvData);
        break;
        
      case 'pdf':
        // In production, you'd use a library like puppeteer or jsPDF
        return res.status(501).json({
          error: 'PDF export not implemented yet',
          code: 'FORMAT_NOT_IMPLEMENTED'
        });
        
      case 'xml':
        const xmlData = convertToXML(scanResults);
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.xml"`);
        res.send(xmlData);
        break;
        
      default: // JSON
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.json"`);
        res.json(scanResults);
    }

    logger.info('Scan results exported', {
      scanId,
      format,
      userId: req.user.id
    });

  } catch (error) {
    logger.error('Failed to export scan results:', error);
    res.status(500).json({
      error: 'Failed to export scan results',
      code: 'SCAN_EXPORT_ERROR'
    });
  }
});

// Quick scan endpoint for common targets
router.post('/quick', requireAnalyst, async (req, res) => {
  try {
    const { target } = req.body;

    if (!target) {
      return res.status(400).json({
        error: 'Target is required',
        code: 'TARGET_REQUIRED'
      });
    }

    logger.info('Starting quick scan', {
      userId: req.user.id,
      target
    });

    const scanOptions = {
      scanType: 'quick',
      userId: req.user.id,
      name: `Quick Scan - ${target}`,
      ports: [21, 22, 23, 25, 53, 80, 135, 139, 443, 445, 3389] // Common ports
    };

    const scanResults = await scanner.performNetworkScan([target], scanOptions);

    res.json({
      message: 'Quick scan completed',
      scan: scanResults
    });

  } catch (error) {
    logger.error('Quick scan failed:', error);
    res.status(500).json({
      error: 'Quick scan failed',
      code: 'QUICK_SCAN_ERROR',
      message: error.message
    });
  }
});

// Get vulnerability details
router.get('/vulnerabilities/:scanId', requireAuth, async (req, res) => {
  try {
    const { scanId } = req.params;
    const { severity, cveId, host } = req.query;

    const scanResults = scanner.getScanResults(scanId);
    
    if (!scanResults) {
      return res.status(404).json({
        error: 'Scan not found',
        code: 'SCAN_NOT_FOUND'
      });
    }

    if (req.user.role !== 'admin' && scanResults.userId !== req.user.id) {
      return res.status(403).json({
        error: 'Access denied',
        code: 'ACCESS_DENIED'
      });
    }

    let vulnerabilities = scanResults.vulnerabilities || [];

    // Apply filters
    if (severity) {
      vulnerabilities = vulnerabilities.filter(v => v.severity === severity.toUpperCase());
    }

    if (cveId) {
      vulnerabilities = vulnerabilities.filter(v => v.cveId.toLowerCase().includes(cveId.toLowerCase()));
    }

    if (host) {
      vulnerabilities = vulnerabilities.filter(v => 
        v.host.toLowerCase().includes(host.toLowerCase()) || 
        v.ip?.toLowerCase().includes(host.toLowerCase())
      );
    }

    // Group vulnerabilities by severity
    const grouped = {
      CRITICAL: vulnerabilities.filter(v => v.severity === 'CRITICAL'),
      HIGH: vulnerabilities.filter(v => v.severity === 'HIGH'),
      MEDIUM: vulnerabilities.filter(v => v.severity === 'MEDIUM'),
      LOW: vulnerabilities.filter(v => v.severity === 'LOW')
    };

    res.json({
      vulnerabilities,
      groupedBySeverity: grouped,
      summary: {
        total: vulnerabilities.length,
        critical: grouped.CRITICAL.length,
        high: grouped.HIGH.length,
        medium: grouped.MEDIUM.length,
        low: grouped.LOW.length
      }
    });

  } catch (error) {
    logger.error('Failed to get vulnerabilities:', error);
    res.status(500).json({
      error: 'Failed to get vulnerabilities',
      code: 'VULNERABILITIES_ERROR'
    });
  }
});

// Helper functions
function calculateEstimatedDuration(targetCount, scanType) {
  const baseTime = {
    quick: 30,    // 30 seconds per target
    full: 300,    // 5 minutes per target
    stealth: 600, // 10 minutes per target
    aggressive: 180 // 3 minutes per target
  };

  return `${Math.ceil(targetCount * (baseTime[scanType] || baseTime.full) / 60)} minutes`;
}

function calculateAverageDuration(scans) {
  if (scans.length === 0) return 0;
  
  const totalDuration = scans.reduce((sum, scan) => sum + (scan.duration || 0), 0);
  return Math.round(totalDuration / scans.length);
}

function calculateScanTrends(scans, period) {
  const trends = {};
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayScans = scans.filter(scan => 
      scan.startTime.startsWith(dateStr)
    );
    
    trends[dateStr] = {
      scans: dayScans.length,
      vulnerabilities: dayScans.reduce((sum, s) => sum + (s.vulnerabilities?.length || 0), 0)
    };
  }

  return trends;
}

function convertToCSV(scanResults) {
  let csv = 'Host,IP,Port,Service,CVE,Vulnerability,Severity,Score,Description,Recommendation\n';
  
  scanResults.vulnerabilities?.forEach(vuln => {
    csv += `"${vuln.host}","${vuln.ip || ''}","${vuln.port || ''}","${vuln.service || ''}","${vuln.cveId}","${vuln.title}","${vuln.severity}","${vuln.cvssScore || ''}","${vuln.description?.replace(/"/g, '""') || ''}","${vuln.recommendation?.replace(/"/g, '""') || ''}"\n`;
  });

  return csv;
}

function convertToXML(scanResults) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<scan>\n';
  xml += `  <scanId>${scanResults.scanId}</scanId>\n`;
  xml += `  <startTime>${scanResults.startTime}</startTime>\n`;
  xml += `  <endTime>${scanResults.endTime || ''}</endTime>\n`;
  xml += `  <status>${scanResults.status}</status>\n`;
  xml += '  <vulnerabilities>\n';
  
  scanResults.vulnerabilities?.forEach(vuln => {
    xml += '    <vulnerability>\n';
    xml += `      <host>${vuln.host}</host>\n`;
    xml += `      <ip>${vuln.ip || ''}</ip>\n`;
    xml += `      <port>${vuln.port || ''}</port>\n`;
    xml += `      <service>${vuln.service || ''}</service>\n`;
    xml += `      <cveId>${vuln.cveId}</cveId>\n`;
    xml += `      <title><![CDATA[${vuln.title}]]></title>\n`;
    xml += `      <severity>${vuln.severity}</severity>\n`;
    xml += `      <cvssScore>${vuln.cvssScore || ''}</cvssScore>\n`;
    xml += `      <description><![CDATA[${vuln.description || ''}]]></description>\n`;
    xml += `      <recommendation><![CDATA[${vuln.recommendation || ''}]]></recommendation>\n`;
    xml += '    </vulnerability>\n';
  });
  
  xml += '  </vulnerabilities>\n';
  xml += '</scan>\n';
  
  return xml;
}

module.exports = router;
