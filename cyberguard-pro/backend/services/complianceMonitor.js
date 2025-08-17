const winston = require('winston');
const moment = require('moment');
const EventEmitter = require('events');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/compliance.log' })
  ]
});

class ComplianceMonitor extends EventEmitter {
  constructor() {
    super();
    this.complianceStandards = new Map();
    this.auditTrail = [];
    this.complianceResults = new Map();
    this.scheduledChecks = new Map();
    
    this.initializeComplianceStandards();
    this.startComplianceMonitoring();
  }

  // Initialize compliance standards and their requirements
  initializeComplianceStandards() {
    const standards = [
      {
        id: 'PCI_DSS',
        name: 'Payment Card Industry Data Security Standard',
        version: '4.0',
        description: 'Security standards for organizations handling credit card data',
        requirements: [
          {
            id: 'PCI_1_1',
            title: 'Install and maintain network security controls',
            description: 'Firewalls and router configuration standards',
            category: 'Network Security',
            severity: 'HIGH',
            checks: [
              'firewall_configured',
              'default_passwords_changed',
              'unnecessary_services_disabled'
            ]
          },
          {
            id: 'PCI_2_1',
            title: 'Apply secure configurations to all system components',
            description: 'Configuration standards for all system components',
            category: 'System Configuration',
            severity: 'HIGH',
            checks: [
              'secure_configurations_applied',
              'vendor_defaults_removed',
              'configuration_hardening'
            ]
          },
          {
            id: 'PCI_3_1',
            title: 'Protect stored cardholder data',
            description: 'Data encryption and storage requirements',
            category: 'Data Protection',
            severity: 'CRITICAL',
            checks: [
              'data_encryption_at_rest',
              'key_management',
              'cardholder_data_inventory'
            ]
          },
          {
            id: 'PCI_4_1',
            title: 'Protect cardholder data with strong cryptography during transmission',
            description: 'Encryption requirements for data in transit',
            category: 'Data Transmission',
            severity: 'CRITICAL',
            checks: [
              'data_encryption_in_transit',
              'tls_configuration',
              'wireless_encryption'
            ]
          },
          {
            id: 'PCI_8_1',
            title: 'Identify users and authenticate access to system components',
            description: 'User identification and authentication requirements',
            category: 'Access Control',
            severity: 'HIGH',
            checks: [
              'unique_user_ids',
              'strong_authentication',
              'multi_factor_authentication'
            ]
          }
        ]
      },
      {
        id: 'GDPR',
        name: 'General Data Protection Regulation',
        version: '2018',
        description: 'EU regulation for data protection and privacy',
        requirements: [
          {
            id: 'GDPR_ART_25',
            title: 'Data protection by design and by default',
            description: 'Privacy by design implementation',
            category: 'Privacy Design',
            severity: 'HIGH',
            checks: [
              'privacy_by_design',
              'data_minimization',
              'purpose_limitation'
            ]
          },
          {
            id: 'GDPR_ART_32',
            title: 'Security of processing',
            description: 'Technical and organizational security measures',
            category: 'Data Security',
            severity: 'HIGH',
            checks: [
              'encryption_pseudonymization',
              'data_integrity_confidentiality',
              'security_testing_assessment'
            ]
          },
          {
            id: 'GDPR_ART_33',
            title: 'Notification of personal data breach',
            description: 'Data breach notification requirements',
            category: 'Incident Response',
            severity: 'CRITICAL',
            checks: [
              'breach_detection_capability',
              'notification_procedures',
              'breach_documentation'
            ]
          },
          {
            id: 'GDPR_ART_35',
            title: 'Data protection impact assessment',
            description: 'DPIA requirements for high-risk processing',
            category: 'Risk Assessment',
            severity: 'MEDIUM',
            checks: [
              'dpia_conducted',
              'risk_assessment_documented',
              'mitigation_measures_implemented'
            ]
          }
        ]
      },
      {
        id: 'SOC2',
        name: 'Service Organization Control 2',
        version: 'Type II',
        description: 'Auditing standard for service organizations',
        requirements: [
          {
            id: 'SOC2_SEC_1',
            title: 'Security - Logical and Physical Access Controls',
            description: 'Access control implementation and monitoring',
            category: 'Security',
            severity: 'HIGH',
            checks: [
              'access_control_policies',
              'user_access_reviews',
              'privileged_access_management'
            ]
          },
          {
            id: 'SOC2_SEC_2',
            title: 'Security - System Operations',
            description: 'System operation monitoring and management',
            category: 'Operations',
            severity: 'HIGH',
            checks: [
              'system_monitoring',
              'incident_response_procedures',
              'change_management'
            ]
          },
          {
            id: 'SOC2_AVAIL_1',
            title: 'Availability - System Availability',
            description: 'System availability monitoring and management',
            category: 'Availability',
            severity: 'MEDIUM',
            checks: [
              'availability_monitoring',
              'backup_procedures',
              'disaster_recovery_planning'
            ]
          },
          {
            id: 'SOC2_CONF_1',
            title: 'Confidentiality - Information Classification',
            description: 'Information classification and handling',
            category: 'Confidentiality',
            severity: 'HIGH',
            checks: [
              'data_classification',
              'confidential_data_handling',
              'information_disposal'
            ]
          }
        ]
      },
      {
        id: 'HIPAA',
        name: 'Health Insurance Portability and Accountability Act',
        version: '2013',
        description: 'US healthcare data protection regulation',
        requirements: [
          {
            id: 'HIPAA_164_312_A',
            title: 'Administrative Safeguards',
            description: 'Administrative procedures for PHI protection',
            category: 'Administrative',
            severity: 'HIGH',
            checks: [
              'security_officer_assigned',
              'workforce_training',
              'information_access_management'
            ]
          },
          {
            id: 'HIPAA_164_312_B',
            title: 'Physical Safeguards',
            description: 'Physical protection of PHI systems',
            category: 'Physical',
            severity: 'HIGH',
            checks: [
              'facility_access_controls',
              'workstation_use_restrictions',
              'device_media_controls'
            ]
          },
          {
            id: 'HIPAA_164_312_C',
            title: 'Technical Safeguards',
            description: 'Technical measures for PHI protection',
            category: 'Technical',
            severity: 'CRITICAL',
            checks: [
              'access_control_unique_ids',
              'audit_controls',
              'integrity_transmission_security'
            ]
          }
        ]
      }
    ];

    standards.forEach(standard => {
      this.complianceStandards.set(standard.id, standard);
    });

    logger.info(`Loaded ${standards.length} compliance standards`);
  }

  // Start compliance monitoring
  startComplianceMonitoring() {
    // Run compliance checks every 6 hours
    setInterval(() => {
      this.runScheduledComplianceChecks();
    }, 6 * 60 * 60 * 1000);

    // Clean up old audit trail entries every day
    setInterval(() => {
      this.cleanupAuditTrail();
    }, 24 * 60 * 60 * 1000);

    logger.info('Compliance monitoring started');
  }

  // Perform comprehensive compliance assessment
  async performComplianceAssessment(standardIds = null, targetSystems = null) {
    const assessmentId = this.generateAssessmentId();
    const startTime = moment();

    try {
      logger.info(`Starting compliance assessment ${assessmentId}`, {
        standards: standardIds,
        systems: targetSystems
      });

      const standards = standardIds || Array.from(this.complianceStandards.keys());
      const results = {
        assessmentId,
        startTime: startTime.toISOString(),
        standards: standards,
        systems: targetSystems || ['all'],
        status: 'running',
        overallScore: 0,
        complianceLevel: 'UNKNOWN',
        findings: [],
        recommendations: [],
        requirementResults: []
      };

      // Assess each standard
      for (const standardId of standards) {
        const standard = this.complianceStandards.get(standardId);
        if (!standard) continue;

        const standardResult = await this.assessStandard(standard, targetSystems);
        results.requirementResults.push(standardResult);
      }

      // Calculate overall compliance score
      results.overallScore = this.calculateOverallScore(results.requirementResults);
      results.complianceLevel = this.determineComplianceLevel(results.overallScore);
      results.findings = this.aggregateFindings(results.requirementResults);
      results.recommendations = this.generateRecommendations(results.findings);

      results.status = 'completed';
      results.endTime = moment().toISOString();
      results.duration = moment().diff(startTime, 'seconds');

      // Store results
      this.complianceResults.set(assessmentId, results);

      // Add to audit trail
      await this.addAuditEntry({
        action: 'COMPLIANCE_ASSESSMENT_COMPLETED',
        assessmentId: assessmentId,
        standards: standards,
        score: results.overallScore,
        level: results.complianceLevel
      });

      logger.info(`Compliance assessment ${assessmentId} completed`, {
        score: results.overallScore,
        level: results.complianceLevel,
        findings: results.findings.length
      });

      return results;

    } catch (error) {
      logger.error(`Compliance assessment ${assessmentId} failed:`, error);
      
      const results = this.complianceResults.get(assessmentId);
      if (results) {
        results.status = 'failed';
        results.error = error.message;
        results.endTime = moment().toISOString();
      }
      
      throw error;
    }
  }

  // Assess individual compliance standard
  async assessStandard(standard, targetSystems) {
    const standardResult = {
      standardId: standard.id,
      standardName: standard.name,
      version: standard.version,
      score: 0,
      status: 'UNKNOWN',
      requirements: []
    };

    try {
      let totalScore = 0;
      let maxPossibleScore = 0;

      for (const requirement of standard.requirements) {
        const reqResult = await this.assessRequirement(requirement, targetSystems);
        standardResult.requirements.push(reqResult);
        
        totalScore += reqResult.score;
        maxPossibleScore += 100; // Each requirement has max score of 100
      }

      standardResult.score = (totalScore / maxPossibleScore) * 100;
      standardResult.status = this.determineRequirementStatus(standardResult.score);

      return standardResult;

    } catch (error) {
      logger.error(`Standard assessment failed for ${standard.id}:`, error);
      standardResult.status = 'ERROR';
      standardResult.error = error.message;
      return standardResult;
    }
  }

  // Assess individual requirement
  async assessRequirement(requirement, targetSystems) {
    const requirementResult = {
      requirementId: requirement.id,
      title: requirement.title,
      category: requirement.category,
      severity: requirement.severity,
      score: 0,
      status: 'NON_COMPLIANT',
      findings: [],
      evidence: []
    };

    try {
      let checksPassed = 0;
      const totalChecks = requirement.checks.length;

      // Perform each check
      for (const checkId of requirement.checks) {
        const checkResult = await this.performComplianceCheck(checkId, requirement, targetSystems);
        
        if (checkResult.passed) {
          checksPassed++;
        } else {
          requirementResult.findings.push({
            checkId: checkId,
            description: checkResult.description,
            severity: checkResult.severity || requirement.severity,
            recommendation: checkResult.recommendation
          });
        }

        if (checkResult.evidence) {
          requirementResult.evidence.push(checkResult.evidence);
        }
      }

      // Calculate score based on checks passed
      requirementResult.score = (checksPassed / totalChecks) * 100;
      requirementResult.status = this.determineRequirementStatus(requirementResult.score);

      return requirementResult;

    } catch (error) {
      logger.error(`Requirement assessment failed for ${requirement.id}:`, error);
      requirementResult.status = 'ERROR';
      requirementResult.error = error.message;
      return requirementResult;
    }
  }

  // Perform individual compliance check
  async performComplianceCheck(checkId, requirement, targetSystems) {
    try {
      // Simulate compliance checks - in production, these would be actual system checks
      switch (checkId) {
        case 'firewall_configured':
          return await this.checkFirewallConfiguration();
        
        case 'data_encryption_at_rest':
          return await this.checkDataEncryptionAtRest();
        
        case 'data_encryption_in_transit':
          return await this.checkDataEncryptionInTransit();
        
        case 'multi_factor_authentication':
          return await this.checkMultiFactorAuthentication();
        
        case 'access_control_policies':
          return await this.checkAccessControlPolicies();
        
        case 'audit_controls':
          return await this.checkAuditControls();
        
        case 'breach_detection_capability':
          return await this.checkBreachDetectionCapability();
        
        case 'privacy_by_design':
          return await this.checkPrivacyByDesign();
        
        default:
          return await this.performGenericComplianceCheck(checkId, requirement);
      }

    } catch (error) {
      logger.error(`Compliance check failed for ${checkId}:`, error);
      return {
        passed: false,
        description: `Check failed due to error: ${error.message}`,
        severity: 'HIGH',
        recommendation: 'Review system configuration and resolve technical issues'
      };
    }
  }

  // Specific compliance checks
  async checkFirewallConfiguration() {
    // Simulate firewall check
    const hasFirewall = Math.random() > 0.2; // 80% chance of having firewall
    
    return {
      passed: hasFirewall,
      description: hasFirewall ? 
        'Network firewall is properly configured' : 
        'Network firewall configuration issues detected',
      severity: hasFirewall ? 'INFO' : 'HIGH',
      recommendation: hasFirewall ? 
        'Continue monitoring firewall configuration' : 
        'Configure and enable network firewall with appropriate rules',
      evidence: {
        checkType: 'firewall_configuration',
        result: hasFirewall ? 'PASS' : 'FAIL',
        details: 'Automated firewall configuration check'
      }
    };
  }

  async checkDataEncryptionAtRest() {
    const hasEncryption = Math.random() > 0.3; // 70% chance of having encryption
    
    return {
      passed: hasEncryption,
      description: hasEncryption ? 
        'Data at rest is properly encrypted' : 
        'Data at rest encryption not implemented',
      severity: hasEncryption ? 'INFO' : 'CRITICAL',
      recommendation: hasEncryption ? 
        'Continue monitoring encryption implementation' : 
        'Implement AES-256 encryption for data at rest',
      evidence: {
        checkType: 'data_encryption_at_rest',
        result: hasEncryption ? 'PASS' : 'FAIL',
        details: 'Database and file system encryption check'
      }
    };
  }

  async checkDataEncryptionInTransit() {
    const hasEncryption = Math.random() > 0.1; // 90% chance of having TLS
    
    return {
      passed: hasEncryption,
      description: hasEncryption ? 
        'Data in transit is properly encrypted with TLS' : 
        'Data in transit encryption not properly configured',
      severity: hasEncryption ? 'INFO' : 'CRITICAL',
      recommendation: hasEncryption ? 
        'Continue monitoring TLS configuration' : 
        'Configure TLS 1.3 for all data transmission',
      evidence: {
        checkType: 'data_encryption_in_transit',
        result: hasEncryption ? 'PASS' : 'FAIL',
        details: 'TLS/SSL configuration analysis'
      }
    };
  }

  async checkMultiFactorAuthentication() {
    const hasMFA = Math.random() > 0.4; // 60% chance of having MFA
    
    return {
      passed: hasMFA,
      description: hasMFA ? 
        'Multi-factor authentication is implemented' : 
        'Multi-factor authentication not implemented',
      severity: hasMFA ? 'INFO' : 'HIGH',
      recommendation: hasMFA ? 
        'Continue monitoring MFA implementation' : 
        'Implement MFA for all user accounts, especially privileged accounts',
      evidence: {
        checkType: 'multi_factor_authentication',
        result: hasMFA ? 'PASS' : 'FAIL',
        details: 'User authentication system analysis'
      }
    };
  }

  async checkAccessControlPolicies() {
    const hasPolicy = Math.random() > 0.25; // 75% chance of having policies
    
    return {
      passed: hasPolicy,
      description: hasPolicy ? 
        'Access control policies are documented and implemented' : 
        'Access control policies are missing or inadequate',
      severity: hasPolicy ? 'INFO' : 'HIGH',
      recommendation: hasPolicy ? 
        'Review and update access control policies regularly' : 
        'Develop and implement comprehensive access control policies',
      evidence: {
        checkType: 'access_control_policies',
        result: hasPolicy ? 'PASS' : 'FAIL',
        details: 'Policy documentation and implementation review'
      }
    };
  }

  async checkAuditControls() {
    const hasAuditing = Math.random() > 0.3; // 70% chance of having audit controls
    
    return {
      passed: hasAuditing,
      description: hasAuditing ? 
        'Audit controls are properly implemented' : 
        'Audit controls are insufficient',
      severity: hasAuditing ? 'INFO' : 'HIGH',
      recommendation: hasAuditing ? 
        'Continue monitoring audit trail integrity' : 
        'Implement comprehensive audit logging and monitoring',
      evidence: {
        checkType: 'audit_controls',
        result: hasAuditing ? 'PASS' : 'FAIL',
        details: 'Audit logging system analysis'
      }
    };
  }

  async checkBreachDetectionCapability() {
    const hasDetection = Math.random() > 0.35; // 65% chance of having detection
    
    return {
      passed: hasDetection,
      description: hasDetection ? 
        'Breach detection capabilities are implemented' : 
        'Breach detection capabilities are insufficient',
      severity: hasDetection ? 'INFO' : 'CRITICAL',
      recommendation: hasDetection ? 
        'Continue enhancing breach detection capabilities' : 
        'Implement automated breach detection and response systems',
      evidence: {
        checkType: 'breach_detection_capability',
        result: hasDetection ? 'PASS' : 'FAIL',
        details: 'Security monitoring system analysis'
      }
    };
  }

  async checkPrivacyByDesign() {
    const hasPrivacyByDesign = Math.random() > 0.5; // 50% chance
    
    return {
      passed: hasPrivacyByDesign,
      description: hasPrivacyByDesign ? 
        'Privacy by design principles are implemented' : 
        'Privacy by design principles not adequately implemented',
      severity: hasPrivacyByDesign ? 'INFO' : 'HIGH',
      recommendation: hasPrivacyByDesign ? 
        'Continue monitoring privacy implementation' : 
        'Implement privacy by design principles in all systems',
      evidence: {
        checkType: 'privacy_by_design',
        result: hasPrivacyByDesign ? 'PASS' : 'FAIL',
        details: 'Privacy implementation assessment'
      }
    };
  }

  // Generic compliance check
  async performGenericComplianceCheck(checkId, requirement) {
    const passed = Math.random() > 0.35; // 65% pass rate for generic checks
    
    return {
      passed: passed,
      description: passed ? 
        `${checkId} compliance check passed` : 
        `${checkId} compliance check failed`,
      severity: passed ? 'INFO' : requirement.severity,
      recommendation: passed ? 
        'Continue monitoring compliance status' : 
        `Address ${checkId} compliance requirements`,
      evidence: {
        checkType: checkId,
        result: passed ? 'PASS' : 'FAIL',
        details: `Generic compliance check for ${checkId}`
      }
    };
  }

  // Calculate overall compliance score
  calculateOverallScore(requirementResults) {
    if (requirementResults.length === 0) return 0;
    
    let totalScore = 0;
    let totalRequirements = 0;
    
    requirementResults.forEach(standardResult => {
      standardResult.requirements.forEach(req => {
        totalScore += req.score;
        totalRequirements++;
      });
    });
    
    return totalRequirements > 0 ? totalScore / totalRequirements : 0;
  }

  // Determine compliance level
  determineComplianceLevel(score) {
    if (score >= 95) return 'FULLY_COMPLIANT';
    if (score >= 80) return 'LARGELY_COMPLIANT';
    if (score >= 60) return 'PARTIALLY_COMPLIANT';
    if (score >= 40) return 'MINIMALLY_COMPLIANT';
    return 'NON_COMPLIANT';
  }

  // Determine requirement status
  determineRequirementStatus(score) {
    if (score >= 95) return 'COMPLIANT';
    if (score >= 80) return 'LARGELY_COMPLIANT';
    if (score >= 60) return 'PARTIALLY_COMPLIANT';
    return 'NON_COMPLIANT';
  }

  // Aggregate findings from all assessments
  aggregateFindings(requirementResults) {
    const findings = [];
    
    requirementResults.forEach(standardResult => {
      standardResult.requirements.forEach(req => {
        req.findings.forEach(finding => {
          findings.push({
            ...finding,
            standardId: standardResult.standardId,
            requirementId: req.requirementId,
            requirementTitle: req.title,
            category: req.category
          });
        });
      });
    });
    
    // Sort by severity
    const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3, 'INFO': 4 };
    findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    return findings;
  }

  // Generate recommendations based on findings
  generateRecommendations(findings) {
    const recommendations = [];
    const severityGroups = {};
    
    // Group findings by severity
    findings.forEach(finding => {
      if (!severityGroups[finding.severity]) {
        severityGroups[finding.severity] = [];
      }
      severityGroups[finding.severity].push(finding);
    });
    
    // Generate recommendations for each severity level
    Object.entries(severityGroups).forEach(([severity, severityFindings]) => {
      recommendations.push({
        priority: severity,
        title: `Address ${severity.toLowerCase()} compliance issues`,
        description: `${severityFindings.length} ${severity.toLowerCase()} compliance issues require attention`,
        actions: severityFindings.slice(0, 5).map(f => f.recommendation),
        impactedSystems: [...new Set(severityFindings.map(f => f.standardId))]
      });
    });
    
    return recommendations;
  }

  // Run scheduled compliance checks
  async runScheduledComplianceChecks() {
    try {
      logger.info('Running scheduled compliance checks');
      
      if (process.env.AUTO_COMPLIANCE_SCAN === 'true') {
        const enabledStandards = (process.env.COMPLIANCE_STANDARDS || 'PCI_DSS,GDPR,SOC2').split(',');
        await this.performComplianceAssessment(enabledStandards);
      }
      
    } catch (error) {
      logger.error('Scheduled compliance checks failed:', error);
    }
  }

  // Add audit trail entry
  async addAuditEntry(entry) {
    const auditEntry = {
      id: this.generateAuditId(),
      timestamp: moment().toISOString(),
      user: entry.user || 'system',
      action: entry.action,
      details: entry.details || {},
      ...entry
    };
    
    this.auditTrail.push(auditEntry);
    
    // Keep audit trail size manageable
    if (this.auditTrail.length > 10000) {
      this.auditTrail = this.auditTrail.slice(-8000);
    }
    
    this.emit('auditEntry', auditEntry);
    
    return auditEntry;
  }

  // Clean up old audit trail entries
  cleanupAuditTrail() {
    const cutoff = moment().subtract(90, 'days'); // Keep 90 days
    this.auditTrail = this.auditTrail.filter(entry => 
      moment(entry.timestamp).isAfter(cutoff)
    );
    
    logger.info(`Audit trail cleanup completed. Entries: ${this.auditTrail.length}`);
  }

  // Get compliance dashboard data
  getComplianceDashboard() {
    const recentResults = Array.from(this.complianceResults.values())
      .filter(r => moment(r.startTime).isAfter(moment().subtract(30, 'days')))
      .sort((a, b) => moment(b.startTime).valueOf() - moment(a.startTime).valueOf());
    
    const latest = recentResults[0];
    
    return {
      latestAssessment: latest,
      overallScore: latest?.overallScore || 0,
      complianceLevel: latest?.complianceLevel || 'UNKNOWN',
      totalFindings: latest?.findings.length || 0,
      criticalFindings: latest?.findings.filter(f => f.severity === 'CRITICAL').length || 0,
      standardsAssessed: latest?.standards.length || 0,
      lastAssessmentDate: latest?.startTime || null,
      complianceHistory: recentResults.slice(0, 10).map(r => ({
        date: r.startTime,
        score: r.overallScore,
        level: r.complianceLevel
      })),
      auditTrailCount: this.auditTrail.length
    };
  }

  // Generate assessment ID
  generateAssessmentId() {
    return `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate audit ID
  generateAuditId() {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get compliance results
  getComplianceResults(assessmentId) {
    return this.complianceResults.get(assessmentId);
  }

  // Get audit trail
  getAuditTrail(limit = 100, offset = 0) {
    return this.auditTrail
      .slice()
      .reverse()
      .slice(offset, offset + limit);
  }

  // Get compliance standards
  getComplianceStandards() {
    return Array.from(this.complianceStandards.values());
  }
}

// Initialize compliance monitor
let complianceMonitor;

async function initializeComplianceMonitor() {
  try {
    complianceMonitor = new ComplianceMonitor();
    logger.info('Compliance monitor initialized successfully');
    return complianceMonitor;
  } catch (error) {
    logger.error('Failed to initialize compliance monitor:', error);
    throw error;
  }
}

module.exports = { ComplianceMonitor, initializeComplianceMonitor, complianceMonitor };
