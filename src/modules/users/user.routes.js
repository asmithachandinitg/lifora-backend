const express = require('express');
const router  = express.Router();
const auth    = require('../../middleware/auth.middleware');
const { getProfile, updateProfile, changePassword, updateModules } = require('./user.controller');

router.get('/profile',         auth, getProfile);
router.put('/profile',         auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.put('/modules',         auth, updateModules);

module.exports = router;