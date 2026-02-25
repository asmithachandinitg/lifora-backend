const express = require('express');
const router  = express.Router();
const ctrl    = require('./food.controller');
const auth    = require('../../middleware/auth.middleware');

router.get('/',       auth, ctrl.getFoodEntries);
router.get('/:id',    auth, ctrl.getFoodEntry);
router.post('/',      auth, ctrl.createFoodEntry);
router.put('/:id',    auth, ctrl.updateFoodEntry);
router.delete('/:id', auth, ctrl.deleteFoodEntry);

module.exports = router;
