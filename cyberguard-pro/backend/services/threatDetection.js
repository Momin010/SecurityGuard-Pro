const winston = require('winston');
const moment = require('moment');
const EventEmitter = require('events');

// AI/ML libraries - in production you'd use TensorFlow.js or similar
// For demo purposes, we'll implement simplified ML algorithms

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/threat-detection.log' })
  ]
});

class ThreatDetectionEngine extends EventEmitter {
  constructor() {
    super();
    this.alertThreshold = parseFloat(process.env.ML_CONFIDENCE_THRESHOLD) || 0.85;
    this.anomalyBaseline = new Map();
    this.threatPatterns = new Map();
    this.activeThreats = new Map();
    this.logBuffer = [];
    this.maxBufferSize = 10000;
    
    this.initializeThreatPatterns();
    this.startAnalysisEngine();
  }

  // Initialize known threat patterns
  initializeThreatPatterns() {
    const patterns = [
      {
        id: 'BRUTE_FORCE',
        name: 'Brute Force Attack',
        description: 'Multiple failed authentication attempts',
        indicators: {
          failed_login_threshold: 10,
          timeframe_minutes: 5,
          pattern: /failed.*login|authentication.*failed|invalid.*credentials/i
        },
        severity: 'HIGH',
        score: 8.5
      },
      {
        id: 'SQL_INJECTION',
        name: 'SQL Injection Attack',
        description: 'Malicious SQL query patterns detected',
        indicators: {
          pattern: /(union.*select|or.*1=1|drop.*table|exec.*sp_|xp_cmdshell)/i,
          min_length: 20
        },
        severity: 'CRITICAL',
        score: 9.2
      },
      {
        id: 'XSS_ATTACK',
        name: 'Cross-Site Scripting Attack',
        description: 'XSS attack patterns in web requests',
        indicators: {
          pattern: /(<script|javascript:|on\w+\s*=|eval\(|document\.cookie)/i
        },
        severity: 'HIGH',
        score: 7.8
      },
      {
        id: 'DDoS_PATTERN',
        name: 'DDoS Attack Pattern',
        description: 'Distributed Denial of Service attack indicators',
        indicators: {
          request_threshold: 1000,
          timeframe_minutes: 1,
          unique_ips_threshold: 100
        },
        severity: 'HIGH',
        score: 8.0
      },
      {
        id: 'MALWARE_COMMUNICATION',
        name: 'Malware Communication',
        description: 'Suspicious outbound connections to known malware C&C servers',
        indicators: {
          suspicious_domains: ['malware-tracker.com', 'botnet-command.net'],
          unusual_ports: [1337, 31337, 6667],
          dns_pattern: /^[a-f0-9]{32}\./i
        },
        severity: 'CRITICAL',
        score: 9.5
      },
      {
        id: 'PRIVILEGE_ESCALATION',
        name: 'Privilege Escalation Attempt',
        description: 'Attempts to gain elevated system privileges',
        indicators: {
          pattern: /(sudo.*su|runas.*admin|net.*user.*add|whoami.*admin)/i,
          system_commands: ['net user', 'whoami', 'id', 'groups']
        },
        severity: 'HIGH',
        score: 8.7
      },
      {
        id: 'DATA_EXFILTRATION',
        name: 'Data Exfiltration Pattern',
        description: 'Unusual data transfer patterns indicating data theft',
        indicators: {
          data_size_threshold: 100 * 1024 * 1024, // 100MB
          file_patterns: [/\.sql$/, /\.csv$/, /\.xlsx?$/, /backup/i],
          compression_patterns: [/\.zip$/, /\.rar$/, /\.7z$/]
        },
        severity: 'CRITICAL',
        score: 9.0
      }
    ];

    patterns.forEach(pattern => {
      this.threatPatterns.set(pattern.id, pattern);
    });

    logger.info(`Loaded ${patterns.length} threat detection patterns`);
  }

  // Start the real-time analysis engine
  startAnalysisEngine() {
    // Process log buffer every 5 seconds
    setInterval(() => {
      this.processLogBuffer();
    }, 5000);

    // Update anomaly baselines every hour
    setInterval(() => {
      this.updateAnomalyBaselines();
    }, 3600000);

    // Clean up old threats every 15 minutes
    setInterval(() => {
      this.cleanupOldThreats();
    }, 900000);

    logger.info('Threat detection engine started');
  }

  // Analyze incoming log entry
  async analyzeLogEntry(logEntry) {
    try {
      // Add to buffer for batch processing
      this.logBuffer.push({
        ...logEntry,
        timestamp: moment().toISOString(),
        analyzed: false
      });

      // Keep buffer size manageable
      if (this.logBuffer.length > this.maxBufferSize) {
        this.logBuffer = this.logBuffer.slice(-this.maxBufferSize * 0.8);
      }

      // Immediate analysis for critical patterns
      const immediateThreats = await this.detectImmediateThreats(logEntry);
      
      for (const threat of immediateThreats) {
        await this.handleThreatDetection(threat);
      }

      return immediateThreats;

    } catch (error) {
      logger.error('Log analysis failed:', error);
      return [];
    }
  }

  // Detect immediate threats in log entry
  async detectImmediateThreats(logEntry) {
    const threats = [];
    const content = JSON.stringify(logEntry).toLowerCase();

    for (const [patternId, pattern] of this.threatPatterns) {
      try {
        let score = 0;
        let matched = false;

        // Pattern matching
        if (pattern.indicators.pattern && pattern.indicators.pattern.test(content)) {
          matched = true;
          score += pattern.score;
        }

        // Check for specific indicators
        if (pattern.id === 'BRUTE_FORCE') {
          const bruteForceScore = await this.analyzeBruteForce(logEntry);
          if (bruteForceScore > 0) {
            matched = true;
            score += bruteForceScore;
          }
        }

        if (pattern.id === 'DDoS_PATTERN') {
          const ddosScore = await this.analyzeDDoSPattern(logEntry);
          if (ddosScore > 0) {
            matched = true;
            score += ddosScore;
          }
        }

        if (matched && score >= (this.alertThreshold * 10)) {
          threats.push({
            id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            patternId,
            type: pattern.name,
            description: pattern.description,
            severity: pattern.severity,
            score: Math.min(score, 10.0),
            confidence: Math.min(score / 10.0, 1.0),
            sourceIp: logEntry.sourceIp || logEntry.ip || 'unknown',
            targetHost: logEntry.targetHost || logEntry.host || 'unknown',
            logEntry: logEntry,
            detectedAt: moment().toISOString(),
            status: 'active'
          });
        }

      } catch (error) {
        logger.error(`Pattern analysis failed for ${patternId}:`, error);
      }
    }

    return threats;
  }

  // Analyze brute force attack patterns
  async analyzeBruteForce(logEntry) {
    const key = `brute_force_${logEntry.sourceIp || logEntry.ip}`;
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const threshold = 10;

    if (!this.anomalyBaseline.has(key)) {
      this.anomalyBaseline.set(key, []);
    }

    const events = this.anomalyBaseline.get(key);
    const now = moment();

    // Add current event if it indicates failed authentication
    const content = JSON.stringify(logEntry).toLowerCase();
    if (content.includes('failed') || content.includes('invalid') || content.includes('denied')) {
      events.push(now.valueOf());
    }

    // Remove old events outside time window
    const recentEvents = events.filter(timestamp => now.valueOf() - timestamp < timeWindow);
    this.anomalyBaseline.set(key, recentEvents);

    // Calculate score based on frequency
    if (recentEvents.length >= threshold) {
      return 8.0 + Math.min(recentEvents.length - threshold, 20) * 0.1;
    }

    return 0;
  }

  // Analyze DDoS attack patterns
  async analyzeDDoSPattern(logEntry) {
    const timeWindow = 60 * 1000; // 1 minute
    const requestThreshold = 1000;
    const uniqueIpThreshold = 100;

    const key = 'ddos_analysis';
    if (!this.anomalyBaseline.has(key)) {
      this.anomalyBaseline.set(key, { requests: [], ips: new Set() });
    }

    const analysis = this.anomalyBaseline.get(key);
    const now = moment();

    // Add current request
    analysis.requests.push(now.valueOf());
    if (logEntry.sourceIp) {
      analysis.ips.add(logEntry.sourceIp);
    }

    // Remove old requests
    analysis.requests = analysis.requests.filter(timestamp => now.valueOf() - timestamp < timeWindow);

    // Calculate DDoS score
    const requestCount = analysis.requests.length;
    const uniqueIps = analysis.ips.size;

    if (requestCount >= requestThreshold && uniqueIps >= uniqueIpThreshold) {
      return 8.0 + Math.min((requestCount - requestThreshold) / 100, 2.0);
    }

    return 0;
  }

  // Process log buffer for batch analysis
  async processLogBuffer() {
    try {
      const unanalyzed = this.logBuffer.filter(entry => !entry.analyzed);
      if (unanalyzed.length === 0) return;

      logger.info(`Processing ${unanalyzed.length} log entries for batch analysis`);

      // Perform anomaly detection on batch
      const anomalies = await this.detectAnomalies(unanalyzed);
      
      // Process detected anomalies
      for (const anomaly of anomalies) {
        await this.handleThreatDetection(anomaly);
      }

      // Mark entries as analyzed
      unanalyzed.forEach(entry => entry.analyzed = true);

      logger.info(`Batch analysis completed. Found ${anomalies.length} anomalies`);

    } catch (error) {
      logger.error('Batch processing failed:', error);
    }
  }

  // Detect anomalies using statistical analysis
  async detectAnomalies(logEntries) {
    const anomalies = [];

    try {
      // Group entries by source IP for behavioral analysis
      const ipGroups = new Map();
      
      logEntries.forEach(entry => {
        const ip = entry.sourceIp || entry.ip || 'unknown';
        if (!ipGroups.has(ip)) {
          ipGroups.set(ip, []);
        }
        ipGroups.get(ip).push(entry);
      });

      // Analyze each IP's behavior
      for (const [ip, entries] of ipGroups) {
        const anomaly = await this.analyzeIPBehavior(ip, entries);
        if (anomaly) {
          anomalies.push(anomaly);
        }
      }

      // Time-based anomaly detection
      const timeAnomalies = await this.detectTimeBasedAnomalies(logEntries);
      anomalies.push(...timeAnomalies);

      // Protocol anomaly detection
      const protocolAnomalies = await this.detectProtocolAnomalies(logEntries);
      anomalies.push(...protocolAnomalies);

    } catch (error) {
      logger.error('Anomaly detection failed:', error);
    }

    return anomalies;
  }

  // Analyze individual IP behavior for anomalies
  async analyzeIPBehavior(ip, entries) {
    try {
      // Calculate request frequency
      const timeSpan = moment.duration(
        moment(entries[entries.length - 1].timestamp).diff(entries[0].timestamp)
      ).asMinutes();
      
      const requestRate = entries.length / Math.max(timeSpan, 1);
      
      // Check for abnormal request patterns
      if (requestRate > 100) { // More than 100 requests per minute
        return {
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'High Request Rate Anomaly',
          description: `Abnormally high request rate from IP ${ip}`,
          severity: 'HIGH',
          score: Math.min(8.0 + (requestRate - 100) / 50, 10.0),
          confidence: 0.85,
          sourceIp: ip,
          details: {
            requestRate: requestRate,
            totalRequests: entries.length,
            timeSpanMinutes: timeSpan
          },
          detectedAt: moment().toISOString(),
          status: 'active'
        };
      }

      // Check for diverse endpoint access (possible scanning)
      const uniqueEndpoints = new Set(entries.map(e => e.url || e.endpoint || ''));
      if (uniqueEndpoints.size > 50) {
        return {
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'Endpoint Scanning Anomaly',
          description: `Suspicious endpoint scanning behavior from IP ${ip}`,
          severity: 'MEDIUM',
          score: 7.5,
          confidence: 0.80,
          sourceIp: ip,
          details: {
            uniqueEndpoints: uniqueEndpoints.size,
            totalRequests: entries.length
          },
          detectedAt: moment().toISOString(),
          status: 'active'
        };
      }

    } catch (error) {
      logger.error(`IP behavior analysis failed for ${ip}:`, error);
    }

    return null;
  }

  // Detect time-based anomalies
  async detectTimeBasedAnomalies(logEntries) {
    const anomalies = [];

    try {
      // Group entries by hour
      const hourlyDistribution = new Map();
      
      logEntries.forEach(entry => {
        const hour = moment(entry.timestamp).hour();
        hourlyDistribution.set(hour, (hourlyDistribution.get(hour) || 0) + 1);
      });

      // Calculate average and detect spikes
      const hours = Array.from(hourlyDistribution.values());
      const average = hours.reduce((sum, count) => sum + count, 0) / hours.length;
      const threshold = average * 3; // 3x average is anomalous

      for (const [hour, count] of hourlyDistribution) {
        if (count > threshold) {
          anomalies.push({
            id: `time_anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'Time-based Traffic Anomaly',
            description: `Unusual traffic spike at hour ${hour}`,
            severity: 'MEDIUM',
            score: 6.5,
            confidence: 0.75,
            details: {
              hour: hour,
              requestCount: count,
              average: average,
              threshold: threshold
            },
            detectedAt: moment().toISOString(),
            status: 'active'
          });
        }
      }

    } catch (error) {
      logger.error('Time-based anomaly detection failed:', error);
    }

    return anomalies;
  }

  // Detect protocol-based anomalies
  async detectProtocolAnomalies(logEntries) {
    const anomalies = [];

    try {
      // Analyze HTTP method distribution
      const methodDistribution = new Map();
      
      logEntries.forEach(entry => {
        const method = entry.method || 'UNKNOWN';
        methodDistribution.set(method, (methodDistribution.get(method) || 0) + 1);
      });

      // Check for unusual method usage
      const totalRequests = logEntries.length;
      
      for (const [method, count] of methodDistribution) {
        const percentage = (count / totalRequests) * 100;
        
        // Flag unusual methods or high percentage of non-GET requests
        if ((method === 'DELETE' && percentage > 5) || 
            (method === 'PUT' && percentage > 10) ||
            (method === 'PATCH' && percentage > 5)) {
          
          anomalies.push({
            id: `protocol_anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'Protocol Usage Anomaly',
            description: `Unusual ${method} method usage pattern`,
            severity: 'MEDIUM',
            score: 6.0,
            confidence: 0.70,
            details: {
              method: method,
              count: count,
              percentage: percentage
            },
            detectedAt: moment().toISOString(),
            status: 'active'
          });
        }
      }

    } catch (error) {
      logger.error('Protocol anomaly detection failed:', error);
    }

    return anomalies;
  }

  // Handle threat detection - emit events and store
  async handleThreatDetection(threat) {
    try {
      // Store active threat
      this.activeThreats.set(threat.id, threat);

      // Emit threat detection event
      this.emit('threatDetected', threat);

      // Log threat detection
      logger.warn('Threat detected', {
        id: threat.id,
        type: threat.type,
        severity: threat.severity,
        score: threat.score,
        sourceIp: threat.sourceIp,
        confidence: threat.confidence
      });

      // Trigger automated response if configured
      if (threat.severity === 'CRITICAL' && process.env.ENABLE_AUTO_RESPONSE === 'true') {
        await this.triggerAutomatedResponse(threat);
      }

    } catch (error) {
      logger.error('Threat handling failed:', error);
    }
  }

  // Trigger automated response to threats
  async triggerAutomatedResponse(threat) {
    try {
      logger.info(`Triggering automated response for threat ${threat.id}`);

      // Example automated responses
      switch (threat.type) {
        case 'Brute Force Attack':
          // Block IP temporarily
          await this.blockIP(threat.sourceIp, '15m');
          break;
          
        case 'DDoS Attack Pattern':
          // Activate rate limiting
          await this.activateRateLimiting(threat.sourceIp);
          break;
          
        case 'SQL Injection Attack':
          // Block and alert
          await this.blockIP(threat.sourceIp, '1h');
          await this.sendSecurityAlert(threat);
          break;
      }

    } catch (error) {
      logger.error(`Automated response failed for threat ${threat.id}:`, error);
    }
  }

  // Block IP address (placeholder for actual implementation)
  async blockIP(ip, duration) {
    logger.info(`Blocking IP ${ip} for ${duration}`);
    // In production, this would integrate with firewall/proxy
  }

  // Activate rate limiting (placeholder)
  async activateRateLimiting(ip) {
    logger.info(`Activating rate limiting for IP ${ip}`);
    // In production, this would integrate with load balancer
  }

  // Send security alert (placeholder)
  async sendSecurityAlert(threat) {
    logger.info(`Sending security alert for threat ${threat.id}`);
    // In production, this would send emails/Slack notifications
  }

  // Update anomaly baselines periodically
  updateAnomalyBaselines() {
    logger.info('Updating anomaly detection baselines');
    // Clean up old baseline data
    for (const [key, data] of this.anomalyBaseline) {
      if (Array.isArray(data)) {
        // Keep only recent data points
        const cutoff = moment().subtract(24, 'hours').valueOf();
        const recent = data.filter(timestamp => timestamp > cutoff);
        this.anomalyBaseline.set(key, recent);
      }
    }
  }

  // Clean up old threat data
  cleanupOldThreats() {
    const cutoff = moment().subtract(7, 'days');
    
    for (const [threatId, threat] of this.activeThreats) {
      if (moment(threat.detectedAt).isBefore(cutoff)) {
        this.activeThreats.delete(threatId);
      }
    }
  }

  // Get active threats
  getActiveThreats() {
    return Array.from(this.activeThreats.values());
  }

  // Get threat statistics
  getThreatStatistics() {
    const threats = Array.from(this.activeThreats.values());
    const last24h = moment().subtract(24, 'hours');
    const recent = threats.filter(t => moment(t.detectedAt).isAfter(last24h));

    return {
      totalThreats: threats.length,
      recentThreats: recent.length,
      criticalThreats: threats.filter(t => t.severity === 'CRITICAL').length,
      highThreats: threats.filter(t => t.severity === 'HIGH').length,
      mediumThreats: threats.filter(t => t.severity === 'MEDIUM').length,
      lowThreats: threats.filter(t => t.severity === 'LOW').length,
      topSourceIPs: this.getTopSourceIPs(threats),
      threatTypes: this.getThreatTypeDistribution(threats)
    };
  }

  // Get top source IPs by threat count
  getTopSourceIPs(threats) {
    const ipCounts = new Map();
    
    threats.forEach(threat => {
      const ip = threat.sourceIp;
      ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
    });

    return Array.from(ipCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));
  }

  // Get threat type distribution
  getThreatTypeDistribution(threats) {
    const typeCounts = new Map();
    
    threats.forEach(threat => {
      const type = threat.type;
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    });

    return Array.from(typeCounts.entries()).map(([type, count]) => ({ type, count }));
  }
}

// Initialize threat detection engine
let threatEngine;

async function initializeThreatDetection() {
  try {
    threatEngine = new ThreatDetectionEngine();
    logger.info('Threat detection engine initialized successfully');
    return threatEngine;
  } catch (error) {
    logger.error('Failed to initialize threat detection engine:', error);
    throw error;
  }
}

module.exports = { ThreatDetectionEngine, initializeThreatDetection, threatEngine };
