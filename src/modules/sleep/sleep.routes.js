const express = require('express');
const router = express.Router();
const ctrl = require('./sleep.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/',     auth, ctrl.getSleepEntries);
router.get('/:id',  auth, ctrl.getSleepEntry);
router.post('/',    auth, ctrl.createSleepEntry);
router.put('/:id',  auth, ctrl.updateSleepEntry);
router.delete('/:id', auth, ctrl.deleteSleepEntry);

module.exports = router;
