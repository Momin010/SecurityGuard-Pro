const express = require('express');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const moment = require('moment');

const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  generateRefreshToken,
  verifyRefreshToken 
} = require('../middleware/auth');

const router = express.Router();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// In-memory user store for demo (use database in production)
const users = new Map();
const refreshTokens = new Set();

// Default admin user for demo
(async () => {
  const adminUser = {
    id: 'admin-001',
    email: 'admin@cyberguard-pro.com',
    password: await hashPassword('CyberGuard2024!'),
    role: 'admin',
    name: 'System Administrator',
    createdAt: moment().toISOString(),
    lastLogin: null,
    isActive: true,
    permissions: [
      'scan:create',
      'scan:read',
      'scan:delete',
      'threats:read',
      'threats:manage',
      'compliance:read',
      'compliance:assess',
      'users:manage',
      'settings:manage'
    ]
  };
  users.set(adminUser.email, adminUser);
  
  // Demo analyst user
  const analystUser = {
    id: 'analyst-001',
    email: 'analyst@cyberguard-pro.com',
    password: await hashPassword('Analyst2024!'),
    role: 'analyst',
    name: 'Security Analyst',
    createdAt: moment().toISOString(),
    lastLogin: null,
    isActive: true,
    permissions: [
      'scan:create',
      'scan:read',
      'threats:read',
      'threats:manage',
      'compliance:read'
    ]
  };
  users.set(analystUser.email, analystUser);
  
  // Demo viewer user
  const viewerUser = {
    id: 'viewer-001',
    email: 'viewer@cyberguard-pro.com',
    password: await hashPassword('Viewer2024!'),
    role: 'viewer',
    name: 'Security Viewer',
    createdAt: moment().toISOString(),
    lastLogin: null,
    isActive: true,
    permissions: [
      'scan:read',
      'threats:read',
      'compliance:read'
    ]
  };
  users.set(viewerUser.email, viewerUser);
})();

// Input validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Role must be viewer, analyst, or admin')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

// User registration
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { email, password, name, role = 'viewer' } = req.body;

    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({
        error: 'User already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: moment().toISOString(),
      lastLogin: null,
      isActive: true,
      permissions: getRolePermissions(role)
    };

    users.set(email, user);

    logger.info('User registered', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    logger.error('Registration failed:', error);
    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// User login
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.get(email);
    if (!user) {
      logger.warn('Login attempt with non-existent email', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn('Login attempt by inactive user', {
        userId: user.id,
        email: user.email,
        ip: req.ip
      });
      
      return res.status(401).json({
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      logger.warn('Login attempt with invalid password', {
        userId: user.id,
        email: user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(401).json({
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    user.lastLogin = moment().toISOString();

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token
    refreshTokens.add(refreshToken);

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Return user data and tokens (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRATION || '24h'
    });

  } catch (error) {
    logger.error('Login failed:', error);
    res.status(500).json({
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

// Token refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token required',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    if (!refreshTokens.has(refreshToken)) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user
    const user = Array.from(users.values()).find(u => u.id === decoded.id);
    if (!user || !user.isActive) {
      refreshTokens.delete(refreshToken);
      return res.status(401).json({
        error: 'Invalid refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Replace refresh tokens
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);

    logger.info('Token refreshed', {
      userId: user.id,
      email: user.email,
      ip: req.ip
    });

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: process.env.JWT_EXPIRATION || '24h'
    });

  } catch (error) {
    logger.error('Token refresh failed:', error);
    res.status(401).json({
      error: 'Token refresh failed',
      code: 'REFRESH_ERROR'
    });
  }
});

// User logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      refreshTokens.delete(refreshToken);
    }

    logger.info('User logged out', {
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout failed:', error);
    res.status(500).json({
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'UNAUTHORIZED'
      });
    }

    // This is a simplified version - in production, use the authenticateToken middleware
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = Array.from(users.values()).find(u => u.id === decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword
    });

  } catch (error) {
    logger.error('Profile fetch failed:', error);
    res.status(401).json({
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
});

// Update user profile
router.put('/profile', 
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          error: 'Access token required',
          code: 'UNAUTHORIZED'
        });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = Array.from(users.values()).find(u => u.id === decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        });
      }

      // Update user data
      const { name, email } = req.body;
      
      if (name) user.name = name;
      if (email && email !== user.email) {
        // Check if new email already exists
        if (users.has(email)) {
          return res.status(409).json({
            error: 'Email already in use',
            code: 'EMAIL_EXISTS'
          });
        }
        
        // Update email
        users.delete(user.email);
        user.email = email;
        users.set(email, user);
      }

      user.updatedAt = moment().toISOString();

      logger.info('User profile updated', {
        userId: user.id,
        email: user.email,
        ip: req.ip
      });

      // Return updated user data (without password)
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });

    } catch (error) {
      logger.error('Profile update failed:', error);
      res.status(500).json({
        error: 'Profile update failed',
        code: 'UPDATE_ERROR'
      });
    }
  }
);

// Change password
router.put('/password',
  body('currentPassword').isLength({ min: 1 }).withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must meet security requirements'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          error: 'Access token required',
          code: 'UNAUTHORIZED'
        });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = Array.from(users.values()).find(u => u.id === decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        logger.warn('Password change attempt with invalid current password', {
          userId: user.id,
          email: user.email,
          ip: req.ip
        });
        
        return res.status(400).json({
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Hash new password
      user.password = await hashPassword(newPassword);
      user.updatedAt = moment().toISOString();

      logger.info('User password changed', {
        userId: user.id,
        email: user.email,
        ip: req.ip
      });

      res.json({
        message: 'Password changed successfully'
      });

    } catch (error) {
      logger.error('Password change failed:', error);
      res.status(500).json({
        error: 'Password change failed',
        code: 'PASSWORD_CHANGE_ERROR'
      });
    }
  }
);

// Get role permissions
function getRolePermissions(role) {
  const permissions = {
    viewer: [
      'scan:read',
      'threats:read',
      'compliance:read'
    ],
    analyst: [
      'scan:create',
      'scan:read',
      'threats:read',
      'threats:manage',
      'compliance:read'
    ],
    admin: [
      'scan:create',
      'scan:read',
      'scan:delete',
      'threats:read',
      'threats:manage',
      'compliance:read',
      'compliance:assess',
      'users:manage',
      'settings:manage'
    ]
  };

  return permissions[role] || permissions.viewer;
}

// Demo endpoint to get default credentials
router.get('/demo-credentials', (req, res) => {
  res.json({
    message: 'Demo credentials for CyberGuard Pro',
    credentials: [
      {
        role: 'admin',
        email: 'admin@cyberguard-pro.com',
        password: 'CyberGuard2024!',
        permissions: 'Full system access'
      },
      {
        role: 'analyst',
        email: 'analyst@cyberguard-pro.com',
        password: 'Analyst2024!',
        permissions: 'Security analysis and scanning'
      },
      {
        role: 'viewer',
        email: 'viewer@cyberguard-pro.com',
        password: 'Viewer2024!',
        permissions: 'Read-only access'
      }
    ]
  });
});

module.exports = router;
