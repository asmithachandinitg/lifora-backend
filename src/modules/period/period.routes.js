const express = require('express');
const router  = express.Router();
const ctrl    = require('./period.controller');
const auth    = require('../../middleware/auth.middleware');

// Period entries  →  /api/period
router.get('/',       auth, ctrl.getEntries);
router.post('/',      auth, ctrl.createEntry);
router.put('/:id',    auth, ctrl.updateEntry);
router.delete('/:id', auth, ctrl.deleteEntry);

module.exports = router;

// ── In app.js also register daily symptoms separately ──────────
// const dailyRouter = require('./modules/period/daily-symptoms.routes');
// app.use('/api/daily-symptoms', dailyRouter);
