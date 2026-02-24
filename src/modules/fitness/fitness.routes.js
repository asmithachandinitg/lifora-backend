const express = require('express');
const router = express.Router();
const ctrl = require('./fitness.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/',          auth, ctrl.getWorkouts);
router.get('/records',   auth, ctrl.getPersonalRecords);
router.get('/:id',       auth, ctrl.getWorkout);
router.post('/',         auth, ctrl.createWorkout);
router.put('/:id',       auth, ctrl.updateWorkout);
router.delete('/:id',    auth, ctrl.deleteWorkout);

module.exports = router;
