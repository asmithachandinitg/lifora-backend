const express = require('express');
const router = express.Router();
const ctrl = require('./pregnancy.controller');
const auth = require('../../middleware/auth.middleware');

// Profile
router.get('/profile',  auth, ctrl.getProfile);
router.post('/profile', auth, ctrl.saveProfile);

// Entries
router.get('/',       auth, ctrl.getEntries);
router.get('/:id',    auth, ctrl.getEntry);
router.post('/',      auth, ctrl.createEntry);
router.put('/:id',    auth, ctrl.updateEntry);
router.delete('/:id', auth, ctrl.deleteEntry);

module.exports = router;
