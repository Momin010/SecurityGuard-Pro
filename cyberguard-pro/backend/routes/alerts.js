const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/active', requireAuth, (req, res) => {
  res.json({ alerts: [], total: 0 });
});

module.exports = router;
