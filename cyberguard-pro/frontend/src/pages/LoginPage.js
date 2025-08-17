import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Divider,
  Chip,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Security,
  Shield,
  Assessment,
  Verified,
  Speed,
  AdminPanelSettings,
  Analytics,
  RemoveRedEye
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/Loading/LoadingScreen';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    
    const result = await login(demoEmail, demoPassword);
    if (!result.success) {
      setError(result.error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const demoAccounts = [
    {
      role: 'Admin',
      email: 'admin@cyberguard-pro.com',
      password: 'CyberGuard2024!',
      description: 'Full system access & management',
      icon: <AdminPanelSettings />,
      color: '#8B5CF6'
    },
    {
      role: 'Analyst',
      email: 'analyst@cyberguard-pro.com',
      password: 'Analyst2024!',
      description: 'Security analysis & scanning',
      icon: <Analytics />,
      color: '#3B82F6'
    },
    {
      role: 'Viewer',
      email: 'viewer@cyberguard-pro.com',
      password: 'Viewer2024!',
      description: 'Read-only monitoring access',
      icon: <RemoveRedEye />,
      color: '#10B981'
    }
  ];

  const features = [
    { icon: <Security />, text: 'Advanced Vulnerability Scanning' },
    { icon: <Shield />, text: 'Real-time Threat Detection' },
    { icon: <Assessment />, text: 'Compliance Monitoring' },
    { icon: <Verified />, text: 'Enterprise Security Controls' },
    { icon: <Speed />, text: 'Real-time Analytics Dashboard' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />

      <Grid container sx={{ height: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Left Panel - Features & Branding */}
        <Grid item xs={12} md={7} lg={8}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: 4,
              textAlign: 'center'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <Box sx={{ mb: 4 }}>
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Shield 
                    size={80} 
                    style={{
                      color: '#8B5CF6',
                      filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.5))'
                    }}
                  />
                </motion.div>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #8B5CF6 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                CyberGuard Pro
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontWeight: 300
                }}
              >
                Enterprise Cybersecurity Operations Center
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 6,
                  maxWidth: 600,
                  lineHeight: 1.7
                }}
              >
                Protect your organization with advanced threat detection, vulnerability scanning, 
                and real-time security monitoring. Built for enterprise-scale cybersecurity operations.
              </Typography>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Paper
                sx={{
                  background: 'rgba(17, 17, 17, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  p: 3,
                  maxWidth: 500
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: 'white', mb: 3, fontWeight: 600 }}
                >
                  🛡️ Security Features
                </Typography>
                <List dense>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <ListItem disablePadding>
                        <ListItemIcon
                          sx={{ 
                            color: 'primary.main', 
                            minWidth: 36 
                          }}
                        >
                          {feature.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.text}
                          primaryTypographyProps={{
                            color: 'text.secondary',
                            fontSize: '0.9rem'
                          }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </Paper>
            </motion.div>
          </Box>
        </Grid>

        {/* Right Panel - Login Form */}
        <Grid item xs={12} md={5} lg={4}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ width: '100%', maxWidth: 400 }}
            >
              <Card
                sx={{
                  background: 'rgba(17, 17, 17, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      color: 'white',
                      textAlign: 'center'
                    }}
                  >
                    Welcome Back
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'center',
                      mb: 4
                    }}
                  >
                    Sign in to access your security dashboard
                  </Typography>

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        )
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ mb: 4 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: 'text.secondary' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        mb: 3,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                        }
                      }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </Box>

                  <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                    <Chip 
                      label="Demo Accounts" 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        color: 'primary.main'
                      }} 
                    />
                  </Divider>

                  <Box sx={{ space: 2 }}>
                    {demoAccounts.map((account, index) => (
                      <motion.div
                        key={account.role}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => handleDemoLogin(account.email, account.password)}
                          sx={{
                            mb: 1.5,
                            py: 1.5,
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                            '&:hover': {
                              borderColor: account.color,
                              backgroundColor: `${account.color}15`
                            },
                            justifyContent: 'flex-start',
                            textAlign: 'left'
                          }}
                        >
                          <Box sx={{ color: account.color, mr: 2 }}>
                            {account.icon}
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ 
                                fontWeight: 600, 
                                color: 'white',
                                textTransform: 'none'
                              }}
                            >
                              {account.role} Access
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ 
                                color: 'text.secondary',
                                display: 'block'
                              }}
                            >
                              {account.description}
                            </Typography>
                          </Box>
                        </Button>
                      </motion.div>
                    ))}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.disabled',
                      textAlign: 'center',
                      display: 'block',
                      mt: 3
                    }}
                  >
                    Protected by enterprise-grade security protocols
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginPage;