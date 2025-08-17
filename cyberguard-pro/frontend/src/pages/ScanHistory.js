import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { History } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ScanHistory = () => {
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
            <History sx={{ color: 'primary.main' }} />
            Scan History
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            View and manage your security scan history
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
              Scan History Interface Coming Soon
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Detailed scan history and results will be displayed here
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ScanHistory;