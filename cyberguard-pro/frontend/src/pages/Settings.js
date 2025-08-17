import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'white',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <SettingsIcon sx={{ color: 'primary.main' }} />
            System Settings
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Configure system preferences and security settings
          </Typography>
        </Box>

        <Card
          sx={{
            background: 'rgba(17, 17, 17, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              System Settings Coming Soon
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Comprehensive system configuration options will be available here
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Settings;