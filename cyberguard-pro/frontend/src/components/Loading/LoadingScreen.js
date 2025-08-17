import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        flexDirection: 'column'
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
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%),
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        {/* Logo and brand */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ marginBottom: 24 }}
        >
          <Shield 
            size={64} 
            color="#8B5CF6"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))'
            }}
          />
        </motion.div>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 1,
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
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 4,
            fontSize: '1.1rem'
          }}
        >
          Enterprise Security Platform
        </Typography>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CircularProgress
            size={40}
            thickness={3}
            sx={{
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mt: 3,
              fontSize: '0.9rem'
            }}
          >
            Initializing security protocols...
          </Typography>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: 0,
          right: 0,
          textAlign: 'center'
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            fontSize: '0.8rem'
          }}
        >
          Powered by Advanced Threat Detection & Response
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;