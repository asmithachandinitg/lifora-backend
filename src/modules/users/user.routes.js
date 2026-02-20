const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword
} = require('./user.controller');

const authMiddleware =
  require('../../middleware/auth.middleware');

/* REGISTER */
router.post('/register', registerUser);

/* LOGIN */
router.post('/login', loginUser);

/* PROFILE (Protected) */
router.get(
  '/profile',
  authMiddleware,
  getUserProfile
);

module.exports = router;

router.post(
  '/forgot-password',
  forgotPassword
);
