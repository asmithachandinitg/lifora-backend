const express = require('express');
const router  = express.Router();
const ctrl    = require('./period.controller');
const auth    = require('../../middleware/auth.middleware');

// Daily symptom logs  →  /api/daily-symptoms
router.get('/',       auth, ctrl.getDailyLogs);
router.post('/',      auth, ctrl.createDailyLog);
router.put('/:id',    auth, ctrl.updateDailyLog);
router.delete('/:id', auth, ctrl.deleteDailyLog);

module.exports = router;
