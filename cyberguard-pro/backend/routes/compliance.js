const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', requireAuth, (req, res) => {
  res.json({ 
    overallScore: 85, 
    complianceLevel: 'LARGELY_COMPLIANT',
    lastAssessmentDate: new Date().toISOString()
  });
});

module.exports = router;
