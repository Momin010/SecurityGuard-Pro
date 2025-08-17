import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Security,
  History,
  Shield,
  Assessment,
  Notifications,
  Settings,
  Person,
  Logout,
  ChevronLeft,
  Search,
  Bell
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Security Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
    color: '#8B5CF6'
  },
  {
    text: 'Vulnerability Scanner',
    icon: <Security />,
    path: '/scanner',
    color: '#EF4444'
  },
  {
    text: 'Scan History',
    icon: <History />,
    path: '/scan-history',
    color: '#3B82F6'
  },
  {
    text: 'Threat Detection',
    icon: <Shield />,
    path: '/threats',
    color: '#F59E0B'
  },
  {
    text: 'Compliance',
    icon: <Assessment />,
    path: '/compliance',
    color: '#10B981'
  },
  {
    text: 'Alert Center',
    icon: <Notifications />,
    path: '/alerts',
    color: '#8B5CF6'
  }
];

// Glitch Text Component
const GlitchText = ({ children, ...props }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
          }
          
          .glitch-text {
            position: relative;
          }
          
          .glitch-text.active::before,
          .glitch-text.active::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          .glitch-text.active::before {
            animation: glitch 0.3s infinite;
            color: #ff0000;
            z-index: -1;
          }
          
          .glitch-text.active::after {
            animation: glitch 0.3s infinite reverse;
            color: #00ffff;
            z-index: -2;
          }
        `}
      </style>
      <span 
        className={`glitch-text ${isGlitching ? 'active' : ''}`}
        data-text={children}
        {...props}
      >
        {children}
      </span>
    </>
  );
};

// Animated Menu Item Component
const AnimatedMenuItem = ({ item, isActive, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>
        {`
          @keyframes neonPulse {
            0%, 100% { 
              box-shadow: 0 0 5px ${item.color}, 0 0 10px ${item.color}, 0 0 15px ${item.color};
            }
            50% { 
              box-shadow: 0 0 10px ${item.color}, 0 0 20px ${item.color}, 0 0 30px ${item.color};
            }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          .menu-item-glow {
            animation: slideInLeft 0.6s ease-out;
            animation-delay: ${index * 0.1}s;
            animation-fill-mode: backwards;
          }
        `}
      </style>
      <motion.div
        className="menu-item-glow"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
      >
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              borderRadius: 2,
              mx: 1,
              backgroundColor: isActive ? `${item.color}20` : 'transparent',
              border: isActive ? `2px solid ${item.color}` : '2px solid transparent',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                backgroundColor: `${item.color}15`,
                border: `2px solid ${item.color}`,
                animation: isHovered ? 'neonPulse 2s infinite' : 'none',
              },
              transition: 'all 0.3s ease-in-out',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: isHovered ? 0 : '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)`,
                transition: 'left 0.5s ease-in-out',
              }
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive ? item.color : 'text.secondary',
                minWidth: 40,
                transition: 'all 0.3s ease-in-out',
                transform: isHovered ? 'scale(1.2) rotate(360deg)' : 'scale(1)',
                filter: isActive ? `drop-shadow(0 0 10px ${item.color})` : 'none',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <GlitchText>
                  {item.text}
                </GlitchText>
              }
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? item.color : 'text.secondary',
                textShadow: isActive ? `0 0 10px ${item.color}` : 'none',
              }}
            />
          </ListItemButton>
        </ListItem>
      </motion.div>
    </>
  );
};

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { connected, realTimeData } = useSocket();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getActiveAlerts = () => {
    return realTimeData?.alerts?.filter(alert => 
      alert.status === 'active' && alert.priority === 'high'
    ).length || 3;
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a2a 50%, #0a0a0a 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 0% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }
    }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: `
            linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)
          `,
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'rotate 4s linear infinite',
          }
        }}
      >
        <style>
          {`
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes logoGlow {
              0%, 100% { filter: drop-shadow(0 0 20px #8B5CF6); }
              50% { filter: drop-shadow(0 0 40px #8B5CF6) drop-shadow(0 0 60px #7C3AED); }
            }
          `}
        </style>
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ 
            position: 'relative', 
            zIndex: 1,
            animation: 'logoGlow 3s ease-in-out infinite'
          }}
        >
          <Shield size={40} />
        </motion.div>
        <Typography variant="h6" sx={{ 
          fontWeight: 700, 
          fontSize: '1.3rem',
          position: 'relative',
          zIndex: 1,
          textShadow: '0 0 20px rgba(255,255,255,0.5)'
        }}>
          <GlitchText>CyberGuard Pro</GlitchText>
        </Typography>
        <Typography variant="caption" sx={{ 
          opacity: 0.9, 
          fontSize: '0.75rem',
          position: 'relative',
          zIndex: 1 
        }}>
          Enterprise Security
        </Typography>
      </Box>

      <Divider sx={{ 
        borderColor: 'rgba(139, 92, 246, 0.3)',
        boxShadow: '0 1px 10px rgba(139, 92, 246, 0.3)'
      }} />

      {/* Connection Status */}
      <Box sx={{ p: 2 }}>
        <motion.div
          animate={{
            scale: connected ? [1, 1.05, 1] : [1, 0.95, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Chip
            size="small"
            icon={connected ? <Shield /> : <Security />}
            label={connected ? 'REAL-TIME ACTIVE' : 'RECONNECTING...'}
            color={connected ? 'success' : 'warning'}
            variant="outlined"
            sx={{
              width: '100%',
              fontWeight: 700,
              fontSize: '0.7rem',
              textShadow: connected ? '0 0 10px #10B981' : '0 0 10px #F59E0B',
              boxShadow: connected 
                ? '0 0 20px rgba(16, 185, 129, 0.3)' 
                : '0 0 20px rgba(245, 158, 11, 0.3)',
              border: `2px solid ${connected ? '#10B981' : '#F59E0B'}`,
              '& .MuiChip-label': { 
                fontSize: '0.7rem',
                fontWeight: 700,
              }
            }}
          />
        </motion.div>
      </Box>

      <Divider sx={{ 
        borderColor: 'rgba(139, 92, 246, 0.3)',
        boxShadow: '0 1px 10px rgba(139, 92, 246, 0.3)'
      }} />

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2, position: 'relative', zIndex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <AnimatedMenuItem
              key={item.text}
              item={item}
              isActive={isActive}
              onClick={() => navigate(item.path)}
              index={index}
            />
          );
        })}
      </List>

      <Divider sx={{ 
        borderColor: 'rgba(139, 92, 246, 0.3)',
        mt: 'auto',
        boxShadow: '0 1px 10px rgba(139, 92, 246, 0.3)'
      }} />

      {/* User Info */}
      <Box sx={{ p: 2, mt: 'auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 2,
              background: `
                linear-gradient(135deg, 
                  rgba(139, 92, 246, 0.1) 0%, 
                  rgba(17, 17, 17, 0.8) 100%)
              `,
              border: '2px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                border: '2px solid rgba(139, 92, 246, 0.6)',
              }
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(139, 92, 246, 0.5)',
                  '0 0 40px rgba(139, 92, 246, 0.8)',
                  '0 0 20px rgba(139, 92, 246, 0.5)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  width: 36,
                  height: 36,
                  fontSize: '1rem',
                  fontWeight: 700,
                  border: '2px solid rgba(139, 92, 246, 0.5)',
                }}
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
            </motion.div>
            <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 10px rgba(139, 92, 246, 0.8)'
                }}
              >
                <GlitchText>{user?.name || 'User'}</GlitchText>
              </Typography>
              <Chip
                label={user?.role || 'viewer'}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  color: 'white',
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  '& .MuiChip-label': {
                    textShadow: '0 0 10px rgba(255,255,255,0.5)'
                  }
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: `
            linear-gradient(90deg, 
              rgba(10, 10, 10, 0.95) 0%, 
              rgba(26, 10, 42, 0.95) 50%, 
              rgba(10, 10, 10, 0.95) 100%)
          `,
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />

          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Security Alerts">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton 
                  color="inherit"
                  onClick={() => navigate('/alerts')}
                  sx={{ 
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                    }
                  }}
                >
                  <motion.div
                    animate={{
                      scale: getActiveAlerts() > 0 ? [1, 1.2, 1] : [1],
                    }}
                    transition={{ duration: 1, repeat: getActiveAlerts() > 0 ? Infinity : 0 }}
                  >
                    <Badge 
                      badgeContent={getActiveAlerts()} 
                      color="error"
                      sx={{ 
                        '& .MuiBadge-badge': { 
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          boxShadow: '0 0 10px #EF4444'
                        }
                      }}
                    >
                      <Bell size={20} />
                    </Badge>
                  </motion.div>
                </IconButton>
              </motion.div>
            </Tooltip>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ 
                  ml: 1,
                  '&:hover': {
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                  }
                }}
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                      '0 0 40px rgba(139, 92, 246, 0.6)',
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Avatar
                    sx={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      width: 36,
                      height: 36,
                      fontSize: '1rem',
                      fontWeight: 700,
                      border: '2px solid rgba(139, 92, 246, 0.5)',
                    }}
                  >
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </Avatar>
                </motion.div>
              </IconButton>
            </motion.div>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: 'linear-gradient(135deg, #111111 0%, #1a0a2a 50%, #111111 100%)',
                border: '2px solid rgba(139, 92, 246, 0.3)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                '& .MuiMenuItem-root': {
                  fontSize: '0.9rem',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.1)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                  }
                }
              }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              <Person sx={{ mr: 2, fontSize: '1.2rem' }} />
              <GlitchText>Profile</GlitchText>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
              <Settings sx={{ mr: 2, fontSize: '1.2rem' }} />
              <GlitchText>Settings</GlitchText>
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(139, 92, 246, 0.3)' }} />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2, fontSize: '1.2rem' }} />
              <GlitchText>Logout</GlitchText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: '2px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '8px 0 32px rgba(139, 92, 246, 0.2)'
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: '2px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '8px 0 32px rgba(139, 92, 246, 0.2)'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: `
            linear-gradient(135deg, 
              rgba(0, 0, 0, 0.95) 0%, 
              rgba(10, 5, 20, 0.95) 25%, 
              rgba(26, 10, 42, 0.95) 50%, 
              rgba(10, 5, 20, 0.95) 75%, 
              rgba(0, 0, 0, 0.95) 100%)
          `,
        }}
      >
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.05 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            style={{ minHeight: 'calc(100vh - 64px)' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Layout;