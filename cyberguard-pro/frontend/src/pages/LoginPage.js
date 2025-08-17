import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/Loading/LoadingScreen';

// Hacker Rain Effect Component
const HackerRain = () => {
  const [drops, setDrops] = useState([]);
  
  useEffect(() => {
    const generateDrops = () => {
      const newDrops = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
        char: Math.random() > 0.5 ? '1' : '0',
      }));
      setDrops(newDrops);
    };
    
    generateDrops();
    const interval = setInterval(generateDrops, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes hackerFall {
            0% { 
              transform: translateY(-100vh); 
              opacity: 0; 
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
              transform: translateY(100vh); 
              opacity: 0; 
            }
          }
        `}
      </style>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        {drops.map((drop) => (
          <Box
            key={drop.id}
            sx={{
              position: 'absolute',
              left: `${drop.x}%`,
              top: 0,
              color: '#8B5CF6',
              fontSize: '14px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              textShadow: '0 0 10px #8B5CF6',
              animation: `hackerFall ${drop.duration}s linear infinite`,
              animationDelay: `${drop.delay}s`,
            }}
          >
            {drop.char}
          </Box>
        ))}
      </Box>
    </>
  );
};

// Glitch Text Component
const GlitchText = ({ children, intensity = 'low' }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchChance = intensity === 'high' ? 0.98 : intensity === 'medium' ? 0.95 : 0.97;
    const interval = setInterval(() => {
      if (Math.random() > glitchChance) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <>
      <style>
        {`
          @keyframes textGlitch {
            0% { transform: translate(0); }
            10% { transform: translate(-2px, 2px); }
            20% { transform: translate(-2px, -2px); }
            30% { transform: translate(2px, 2px); }
            40% { transform: translate(2px, -2px); }
            50% { transform: translate(-1px, 2px); }
            60% { transform: translate(-1px, -2px); }
            70% { transform: translate(1px, 1px); }
            80% { transform: translate(1px, -1px); }
            90% { transform: translate(-1px, -1px); }
            100% { transform: translate(0); }
          }
          
          .glitch-container {
            position: relative;
            display: inline-block;
          }
          
          .glitch-container.active::before,
          .glitch-container.active::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
          }
          
          .glitch-container.active::before {
            animation: textGlitch 0.3s infinite;
            color: #ff0040;
            z-index: -1;
          }
          
          .glitch-container.active::after {
            animation: textGlitch 0.3s infinite reverse;
            color: #00ffff;
            z-index: -2;
          }
        `}
      </style>
      <span 
        className={`glitch-container ${isGlitching ? 'active' : ''}`}
        data-text={children}
      >
        {children}
      </span>
    </>
  );
};

// Cyber Button Component
const CyberButton = ({ children, onClick, variant = 'primary', ...props }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    if (onClick) onClick(e);
  };

  return (
    <>
      <style>
        {`
          @keyframes cyberGlow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.1);
            }
            50% { 
              box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), inset 0 0 40px rgba(139, 92, 246, 0.2);
            }
          }
          
          @keyframes scanline {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}
      </style>
      <Button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: variant === 'primary' 
            ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)'
            : 'transparent',
          border: '2px solid #8B5CF6',
          color: 'white',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          animation: isHovered ? 'cyberGlow 1s ease-in-out infinite' : 'none',
          transform: isClicked ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.1s ease-in-out',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: isHovered ? 'scanline 1.5s ease-in-out infinite' : 'none',
          },
          '&:hover': {
            background: variant === 'primary' 
              ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)'
              : 'rgba(139, 92, 246, 0.1)',
          }
        }}
        {...props}
      >
        {children}
      </Button>
    </>
  );
};

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
        background: `
          radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          linear-gradient(135deg, #000000 0%, #0a0510 25%, #1a0a2a 50%, #0a0510 75%, #000000 100%)
        `,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Effects */}
      <HackerRain />
      
      {/* Animated Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Grid container sx={{ height: '100vh', position: 'relative', zIndex: 2 }}>
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {/* Logo */}
              <Box sx={{ mb: 4 }}>
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Shield 
                    sx={{
                      fontSize: '100px',
                      color: '#8B5CF6',
                      filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 60px rgba(139, 92, 246, 0.4))'
                    }}
                  />
                </motion.div>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontSize: { xs: '3rem', md: '4rem', lg: '5rem' },
                  background: `
                    linear-gradient(135deg, 
                      #FFFFFF 0%, 
                      #8B5CF6 30%, 
                      #FFFFFF 60%, 
                      #7C3AED 100%)
                  `,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
                  letterSpacing: '2px'
                }}
              >
                <GlitchText intensity="high">CyberGuard Pro</GlitchText>
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: 'rgba(139, 92, 246, 0.9)',
                  mb: 4,
                  fontWeight: 300,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  textShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                }}
              >
                <GlitchText intensity="medium">Enterprise Cybersecurity Operations Center</GlitchText>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  mb: 6,
                  maxWidth: 600,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.2rem' }
                }}
              >
                Protect your organization with advanced threat detection, vulnerability scanning, 
                and real-time security monitoring. Built for enterprise-scale cybersecurity operations.
              </Typography>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Paper
                sx={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(139, 92, 246, 0.1) 0%, 
                      rgba(17, 17, 17, 0.9) 50%, 
                      rgba(139, 92, 246, 0.05) 100%)
                  `,
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 4,
                  p: 4,
                  maxWidth: 600,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
                    animation: 'scanline 3s ease-in-out infinite',
                  }
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ 
                    color: 'white', 
                    mb: 3, 
                    fontWeight: 700,
                    textAlign: 'center',
                    textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                  }}
                >
                  🛡️ <GlitchText>Security Features</GlitchText>
                </Typography>
                <List dense>
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                    >
                      <ListItem 
                        disablePadding 
                        sx={{ 
                          mb: 1,
                          '&:hover': {
                            transform: 'translateX(10px)',
                            transition: 'transform 0.3s ease'
                          }
                        }}
                      >
                        <ListItemIcon
                          sx={{ 
                            color: '#8B5CF6', 
                            minWidth: 40,
                            filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
                          }}
                        >
                          {feature.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={<GlitchText>{feature.text}</GlitchText>}
                          primaryTypographyProps={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '1.1rem',
                            fontWeight: 500
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
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ width: '100%', maxWidth: 450 }}
            >
              <Card
                sx={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(139, 92, 246, 0.1) 0%, 
                      rgba(17, 17, 17, 0.95) 30%, 
                      rgba(26, 10, 42, 0.95) 70%, 
                      rgba(139, 92, 246, 0.05) 100%)
                  `,
                  backdropFilter: 'blur(30px)',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 4,
                  boxShadow: '0 30px 60px rgba(139, 92, 246, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)',
                    animation: 'scanline 2s ease-in-out infinite',
                  }
                }}
              >
                <CardContent sx={{ p: 5 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      mb: 1,
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '2.5rem',
                      textShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                    }}
                  >
                    <GlitchText intensity="medium">Welcome Back</GlitchText>
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(139, 92, 246, 0.8)',
                      textAlign: 'center',
                      mb: 4,
                      fontSize: '1.1rem'
                    }}
                  >
                    <GlitchText>Sign in to access your security dashboard</GlitchText>
                  </Typography>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert 
                          severity="error" 
                          sx={{ 
                            mb: 3, 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            '& .MuiAlert-message': {
                              color: '#ff6b6b'
                            }
                          }}
                        >
                          <GlitchText>{error}</GlitchText>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Box component="form" onSubmit={handleSubmit}>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ 
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            border: '2px solid rgba(139, 92, 246, 0.3)',
                            background: 'rgba(17, 17, 17, 0.8)',
                            '&:hover': {
                              border: '2px solid rgba(139, 92, 246, 0.5)',
                              boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                            },
                            '&.Mui-focused': {
                              border: '2px solid #8B5CF6',
                              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(139, 92, 246, 0.8)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'white',
                            fontSize: '1.1rem'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: '#8B5CF6' }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ 
                          mb: 4,
                          '& .MuiOutlinedInput-root': {
                            border: '2px solid rgba(139, 92, 246, 0.3)',
                            background: 'rgba(17, 17, 17, 0.8)',
                            '&:hover': {
                              border: '2px solid rgba(139, 92, 246, 0.5)',
                              boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                            },
                            '&.Mui-focused': {
                              border: '2px solid #8B5CF6',
                              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(139, 92, 246, 0.8)',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: 'white',
                            fontSize: '1.1rem'
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: '#8B5CF6' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                sx={{ color: '#8B5CF6' }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CyberButton
                        type="submit"
                        fullWidth
                        variant="primary"
                        size="large"
                        disabled={loading}
                        sx={{
                          py: 2,
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          mb: 4,
                        }}
                      >
                        <GlitchText>{loading ? 'CONNECTING...' : 'ACCESS SYSTEM'}</GlitchText>
                      </CyberButton>
                    </motion.div>
                  </Box>

                  <Divider sx={{ 
                    my: 4, 
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    '&::before, &::after': {
                      borderTop: '2px solid rgba(139, 92, 246, 0.3)'
                    }
                  }}>
                    <Chip 
                      label={<GlitchText>DEMO ACCOUNTS</GlitchText>}
                      size="medium" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        px: 2,
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                      }} 
                    />
                  </Divider>

                  <Box sx={{ space: 2 }}>
                    {demoAccounts.map((account, index) => (
                      <motion.div
                        key={account.role}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.2 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <CyberButton
                          fullWidth
                          variant="secondary"
                          onClick={() => handleDemoLogin(account.email, account.password)}
                          sx={{
                            mb: 2,
                            py: 2,
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            background: `linear-gradient(135deg, ${account.color}15 0%, rgba(17, 17, 17, 0.8) 100%)`,
                            border: `2px solid ${account.color}`,
                          }}
                        >
                          <Box sx={{ color: account.color, mr: 3, fontSize: '1.5rem' }}>
                            {account.icon}
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ 
                                fontWeight: 700, 
                                color: 'white',
                                textTransform: 'uppercase',
                                fontSize: '1rem',
                                textShadow: `0 0 10px ${account.color}`
                              }}
                            >
                              <GlitchText>{account.role} ACCESS</GlitchText>
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.9rem'
                              }}
                            >
                              <GlitchText>{account.description}</GlitchText>
                            </Typography>
                          </Box>
                        </CyberButton>
                      </motion.div>
                    ))}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(139, 92, 246, 0.6)',
                      textAlign: 'center',
                      display: 'block',
                      mt: 4,
                      fontSize: '0.9rem',
                      textShadow: '0 0 10px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <GlitchText>🛡️ PROTECTED BY ENTERPRISE-GRADE SECURITY PROTOCOLS</GlitchText>
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