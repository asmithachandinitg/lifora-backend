const express = require('express');
const router = express.Router();
const ctrl = require('./habit.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/',              auth, ctrl.getHabits);
router.post('/',             auth, ctrl.createHabit);
router.put('/:id',           auth, ctrl.updateHabit);
router.delete('/:id',        auth, ctrl.deleteHabit);
router.post('/:id/log',      auth, ctrl.logCompletion);

module.exports = router;