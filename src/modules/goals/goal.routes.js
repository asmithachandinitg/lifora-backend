const express = require('express');
const router = express.Router();
const ctrl = require('./goal.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/',          auth, ctrl.getGoals);
router.get('/:id',       auth, ctrl.getGoal);
router.post('/',         auth, ctrl.createGoal);
router.put('/:id',       auth, ctrl.updateGoal);
router.patch('/:id/milestones/:milestoneId/toggle', auth, ctrl.toggleMilestone);
router.delete('/:id',    auth, ctrl.deleteGoal);

module.exports = router;
