const express = require('express');
const router = express.Router();
const ctrl = require('./mood.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/', auth, ctrl.getMoods);
router.post('/', auth, ctrl.createMood);
router.delete('/:id', auth, ctrl.deleteMood);

module.exports = router;
