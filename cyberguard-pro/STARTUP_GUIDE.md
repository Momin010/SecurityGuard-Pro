# 🛡️ CyberGuard Pro - Startup Guide

## 🚀 Quick Start

### Prerequisites
1. **Install Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on **http://localhost:5000** 🎉

## 🔐 Demo Credentials

The system comes with pre-configured demo accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@cyberguard-pro.com | CyberGuard2024! | Full system access |
| **Analyst** | analyst@cyberguard-pro.com | Analyst2024! | Security scanning & analysis |
| **Viewer** | viewer@cyberguard-pro.com | Viewer2024! | Read-only access |

## 📡 API Testing with Postman/curl

### 1. Get Demo Credentials
```bash
curl http://localhost:5000/api/auth/demo-credentials
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@cyberguard-pro.com",
  "password": "CyberGuard2024!"
}'
```

**Response:** You'll get a JWT token - copy this for next steps!

### 3. Get Dashboard Overview (requires token)
```bash
curl http://localhost:5000/api/dashboard/overview \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Start a Vulnerability Scan
```bash
curl -X POST http://localhost:5000/api/scanner/start \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "targets": ["127.0.0.1", "google.com"],
  "scanType": "quick",
  "name": "Demo Scan"
}'
```

### 5. Quick Scan Single Target
```bash
curl -X POST http://localhost:5000/api/scanner/quick \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "target": "127.0.0.1"
}'
```

### 6. Get Scan History
```bash
curl http://localhost:5000/api/scanner/history \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Get Security Metrics
```bash
curl http://localhost:5000/api/dashboard/metrics \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🛡️ Key Features Demonstrated

### ✅ **Advanced Security Features**
- JWT authentication with role-based access control
- Rate limiting (100 requests per 15 minutes)
- Security headers (HSTS, CSP, etc.)
- Password hashing with bcrypt
- Input validation and sanitization

### ✅ **Vulnerability Scanning Engine**
- Network port scanning
- Service detection and fingerprinting
- CVE database integration
- Vulnerability assessment with CVSS scoring
- Export capabilities (JSON, CSV, XML)

### ✅ **AI-Powered Threat Detection**
- Real-time log analysis
- Behavioral anomaly detection
- Pattern matching for known attack signatures
- Brute force detection
- DDoS pattern recognition

### ✅ **Compliance Monitoring**
- PCI-DSS compliance checking
- GDPR privacy compliance
- SOC2 security controls
- HIPAA healthcare compliance
- Automated audit trails

### ✅ **Professional API Design**
- RESTful API with consistent error handling
- Comprehensive input validation
- Detailed logging and monitoring
- Pagination and filtering
- Export and reporting capabilities

## 🔧 Environment Configuration

The `.env` file is already configured for development. Key settings:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# JWT Security
JWT_SECRET=cyberguard_super_secret_jwt_key_2024...
JWT_EXPIRATION=24h

# Scanning Settings
DEFAULT_SCAN_PORTS=21,22,23,25,53,80,135,139,443,445,3389
MAX_CONCURRENT_SCANS=5

# AI/ML Settings
ML_CONFIDENCE_THRESHOLD=0.85
ENABLE_ANOMALY_DETECTION=true
```

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Services      │
│   (React)       │◄──►│  (Express API)  │◄──►│  - Scanner      │
│                 │    │                 │    │  - Threat Det.  │
└─────────────────┘    └─────────────────┘    │  - Compliance   │
                                              └─────────────────┘
```

## 🎯 Next Steps

1. **Try the API endpoints** listed above
2. **Explore the scan results** and vulnerability data
3. **Test different user roles** with the demo credentials
4. **Run compliance assessments**
5. **Monitor real-time threat detection**

## 🚀 Production Deployment

For production deployment:

1. **Install PostgreSQL** for persistent data storage
2. **Install Redis** for caching and session management
3. **Configure SSL/TLS** certificates
4. **Set up monitoring** with tools like Prometheus
5. **Configure email notifications** for alerts
6. **Set up automated backups**

## 🆘 Troubleshooting

**Port 5000 already in use?**
```bash
# Change PORT in .env file or:
PORT=3001 npm start
```

**JWT Secret too short?**
- The .env file has a secure 64+ character secret pre-configured

**CORS errors?**
- Frontend URL is configured in .env as http://localhost:3000

## 📚 API Documentation

**Base URL:** `http://localhost:5000/api`

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/refresh` - Refresh JWT token
- `GET /auth/profile` - Get user profile

### Security Scanning
- `POST /scanner/start` - Start vulnerability scan
- `POST /scanner/quick` - Quick scan single target
- `GET /scanner/history` - Get scan history
- `GET /scanner/results/:id` - Get specific scan results
- `GET /scanner/stats` - Get scanning statistics

### Dashboard & Monitoring
- `GET /dashboard/overview` - Security overview metrics
- `GET /dashboard/metrics` - Detailed security metrics
- `GET /threats/active` - Active threat alerts
- `GET /compliance/dashboard` - Compliance status

---

## 🎉 Congratulations!

You now have a **production-grade cybersecurity platform** running locally!

This demonstrates:
- ✅ **Enterprise-level security practices**
- ✅ **Advanced technical architecture**  
- ✅ **Professional API design**
- ✅ **Real-world security capabilities**

**This is exactly the kind of impressive project that big companies love to see!** 🚀
