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

// Matrix Background Component
const MatrixBackground = () => {
  const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
  
  const generateColumn = (index) => {
    const height = Math.random() * 100 + 50;
    const animationDelay = Math.random() * 20;
    const animationDuration = Math.random() * 10 + 15;
    
    return (
      <div
        key={index}
        className="matrix-column"
        style={{
          position: 'absolute',
          left: `${(index * 25)}px`,
          top: '-100px',
          width: '20px',
          height: `${height}%`,
          background: `linear-gradient(180deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.8) 30%, 
            rgba(139, 92, 246, 0.4) 70%, 
            transparent 100%)`,
          animation: `matrixFall ${animationDuration}s linear infinite`,
          animationDelay: `${animationDelay}s`,
          overflow: 'hidden',
          fontSize: '14px',
          color: '#8B5CF6',
          textShadow: '0 0 10px #8B5CF6',
        }}
      >
        {Array.from({ length: Math.floor(height / 20) }, (_, i) => (
          <div key={i} style={{ margin: '2px 0' }}>
            {characters[Math.floor(Math.random() * characters.length)]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes matrixFall {
            0% { transform: translateY(-100vh) scaleY(0); opacity: 0; }
            10% { opacity: 1; scaleY: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.4); }
          }
          
          @keyframes scanLine {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
          
          .matrix-column {
            pointer-events: none;
            font-family: 'Courier New', monospace;
            text-align: center;
            line-height: 1.2;
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
        {Array.from({ length: 80 }, (_, i) => generateColumn(i))}
      </Box>
    </>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 10,
  }));

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(10px) rotate(240deg); }
          }
          
          @keyframes glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
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
          zIndex: 1
        }}
      >
        {particles.map((particle) => (
          <Box
            key={particle.id}
            sx={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
              borderRadius: '50%',
              animation: `float ${particle.duration}s ease-in-out infinite, glow ${particle.duration * 0.7}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              boxShadow: `0 0 ${particle.size * 3}px #8B5CF6`,
            }}
          />
        ))}
      </Box>
    </>
  );
};

// Scan Lines Effect
const ScanLines = () => (
  <>
    <style>
      {`
        .scan-line {
          position: fixed;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.8) 50%, 
            transparent 100%);
          animation: scanLine 8s linear infinite;
          z-index: 2;
          pointer-events: none;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
        }
        
        .scan-line:nth-child(2) {
          animation-delay: 4s;
          height: 1px;
        }
      `}
    </style>
    <Box className="scan-line" />
    <Box className="scan-line" />
  </>
);

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a0a1a 50%, #0a0a0a 75%, #000000 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <MatrixBackground />
      <FloatingParticles />
      <ScanLines />
      
      {/* Ambient Glow Effects */}
      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'pulseGlow 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '30%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'pulseGlow 8s ease-in-out infinite reverse',
        }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ position: 'relative', zIndex: 3, minHeight: '100vh' }}
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