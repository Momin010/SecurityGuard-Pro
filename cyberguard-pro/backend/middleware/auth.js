const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// JWT token verification middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'UNAUTHORIZED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Log authentication for security audit
    logger.info('User authenticated', {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

// Role-based access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      logger.warn('Insufficient privileges', {
        userId: req.user.id,
        userRole: userRole,
        requiredRoles: allowedRoles,
        endpoint: req.originalUrl,
        ip: req.ip
      });

      return res.status(403).json({
        error: 'Insufficient privileges',
        code: 'FORBIDDEN',
        requiredRole: allowedRoles
      });
    }

    next();
  };
};

// Admin-only access middleware
const requireAdmin = requireRole('admin');

// Security analyst or admin access
const requireAnalyst = requireRole(['admin', 'analyst']);

// Any authenticated user (viewer, analyst, admin)
const requireAuth = requireRole(['admin', 'analyst', 'viewer']);

// Password hashing utility
const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

// Password comparison utility
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions || []
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '24h',
    issuer: 'cyberguard-pro',
    audience: 'cyberguard-users'
  });
};

// Generate refresh token
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    type: 'refresh'
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    issuer: 'cyberguard-pro',
    audience: 'cyberguard-users'
  });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// API key authentication for external integrations
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        code: 'API_KEY_REQUIRED'
      });
    }

    // In a real implementation, you'd validate against a database
    // For demo purposes, we'll use a simple check
    const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
    
    if (!validApiKeys.includes(apiKey)) {
      logger.warn('Invalid API key used', {
        apiKey: apiKey.substring(0, 8) + '...',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }

    // Set API client info
    req.apiClient = {
      type: 'external',
      key: apiKey
    };

    logger.info('API key authenticated', {
      apiKey: apiKey.substring(0, 8) + '...',
      ip: req.ip
    });

    next();
  } catch (error) {
    logger.error('API key authentication error', error);
    return res.status(500).json({
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

// Session validation middleware
const validateSession = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    // Check if user account is still active
    // In a real implementation, you'd check against the database
    // This is a placeholder for session validation logic

    const sessionValid = true; // Replace with actual validation

    if (!sessionValid) {
      return res.status(401).json({
        error: 'Session invalid',
        code: 'SESSION_INVALID'
      });
    }

    next();
  } catch (error) {
    logger.error('Session validation error', error);
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireAnalyst,
  requireAuth,
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticateApiKey,
  validateSession
};
