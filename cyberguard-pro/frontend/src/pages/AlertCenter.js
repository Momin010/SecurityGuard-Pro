import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AlertCenter = () => {
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
            <Notifications sx={{ color: 'primary.main' }} />
            Alert Center
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage security alerts and incident response
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
              Alert Center Coming Soon
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Centralized alert management and incident response will be available here
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AlertCenter;