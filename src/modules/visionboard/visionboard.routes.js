// src/modules/visionboard/visionboard.routes.js
const express = require('express');
const router = express.Router();
const { getAll, create, update, remove, markAchieved } = require('./visionboard.controller');
const auth = require('../../middleware/auth.middleware');

router.use(auth);

router.get('/',                   getAll);
router.post('/',                  create);
router.put('/:id',                update);
router.delete('/:id',             remove);
router.patch('/:id/achieved',     markAchieved);

module.exports = router;
