import React, { useState } from 'react';
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
    return realTimeData.alerts?.filter(alert => 
      alert.status === 'active' && alert.priority === 'high'
    ).length || 0;
  };

  const drawer = (
    <Box sx={{ height: '100%', background: '#111111' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Shield size={32} style={{ marginBottom: 8 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
          CyberGuard Pro
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
          Enterprise Security
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Connection Status */}
      <Box sx={{ p: 2 }}>
        <Chip
          size="small"
          icon={connected ? <Shield /> : <Security />}
          label={connected ? 'Real-time Active' : 'Reconnecting...'}
          color={connected ? 'success' : 'warning'}
          variant="outlined"
          sx={{
            width: '100%',
            '& .MuiChip-label': { fontSize: '0.75rem' }
          }}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? item.color : 'text.secondary',
                      minWidth: 40,
                      transition: 'color 0.2s ease-in-out'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'white' : 'text.secondary'
                    }}
                  />
                  {item.path === '/alerts' && getActiveAlerts() > 0 && (
                    <Badge
                      badgeContent={getActiveAlerts()}
                      color="error"
                      sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mt: 'auto' }} />

      {/* User Info */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 32,
              height: 32,
              fontSize: '0.9rem'
            }}
          >
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ ml: 2, flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.85rem',
                color: 'white',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.name || 'User'}
            </Typography>
            <Chip
              label={user?.role || 'viewer'}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                height: 18,
                fontSize: '0.65rem',
                textTransform: 'capitalize'
              }}
            />
          </Box>
        </Box>
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
          background: 'rgba(17, 17, 17, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Security Alerts">
              <IconButton 
                color="inherit"
                onClick={() => navigate('/alerts')}
                sx={{ position: 'relative' }}
              >
                <Badge 
                  badgeContent={getActiveAlerts()} 
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem' } }}
                >
                  <Bell size={20} />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 32,
                  height: 32,
                  fontSize: '0.9rem'
                }}
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                background: '#111111',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                '& .MuiMenuItem-root': {
                  fontSize: '0.9rem'
                }
              }
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              <Person sx={{ mr: 2, fontSize: '1.2rem' }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
              <Settings sx={{ mr: 2, fontSize: '1.2rem' }} />
              Settings
            </MenuItem>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2, fontSize: '1.2rem' }} />
              Logout
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
              background: '#111111',
              border: 'none'
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
              background: '#111111',
              border: 'none',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)'
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
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)'
        }}
      >
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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