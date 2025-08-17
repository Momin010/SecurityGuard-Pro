import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

// Import contexts
import { useAuth } from './contexts/AuthContext';

// Import components
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import VulnerabilityScanner from './pages/VulnerabilityScanner';
import ScanHistory from './pages/ScanHistory';
import ThreatDetection from './pages/ThreatDetection';
import ComplianceDashboard from './pages/ComplianceDashboard';
import AlertCenter from './pages/AlertCenter';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Loading component
import LoadingScreen from './components/Loading/LoadingScreen';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.02) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}
      >
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          
          {/* Protected routes */}
          <Route
            path="/*"
            element={
              user ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/scanner" element={<VulnerabilityScanner />} />
                    <Route path="/scan-history" element={<ScanHistory />} />
                    <Route path="/threats" element={<ThreatDetection />} />
                    <Route path="/compliance" element={<ComplianceDashboard />} />
                    <Route path="/alerts" element={<AlertCenter />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </motion.div>
    </Box>
  );
}

export default App;