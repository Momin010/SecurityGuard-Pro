const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/active', requireAuth, (req, res) => {
  res.json({ threats: [], message: 'No active threats detected' });
});

router.get('/history', requireAuth, (req, res) => {
  res.json({ threats: [], total: 0 });
});

module.exports = router;
