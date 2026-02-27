const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  verifyEmail
} = require('./auth.controller');

/* ========== PUBLIC ROUTES (No auth required) ========== */

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// Reset Password
router.post('/reset-password', resetPassword);

// Verify Email
router.post('/verify-email', verifyEmail);

module.exports = router;
