const User = require('../users/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

/* ========== REGISTER ========== */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, password } = req.body;

    // VALIDATION
    if (!firstName || !lastName || !email || !gender || !password) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // CHECK IF USER EXISTS
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered' 
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = new User({
      firstName,
      lastName,
      email,
      gender,
      password: hashedPassword,
      modules: []
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        gender: newUser.gender
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========== LOGIN ========== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // FIND USER
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // CHECK PASSWORD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // GENERATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========== FORGOT PASSWORD ========== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // VALIDATION
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }

    // FIND USER
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // GENERATE RESET TOKEN (expires in 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // SAVE RESET TOKEN TO USER
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // SEND EMAIL WITH RESET LINK
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${resetToken}`;
    
    await sendEmail(
      email,
      'Password Reset Request',
      `Click here to reset your password: ${resetLink}`
    );

    res.json({
      message: 'Password reset link sent to your email'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========== RESET PASSWORD ========== */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // VALIDATION
    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Token and new password are required' 
      });
    }

    // VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(401).json({ 
        message: 'Invalid or expired token' 
      });
    }

    // FIND USER
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // UPDATE PASSWORD
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({
      message: 'Password reset successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========== VERIFY EMAIL ========== */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: 'Token is required' 
      });
    }

    // VERIFY TOKEN
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(401).json({ 
        message: 'Invalid or expired token' 
      });
    }

    // FIND USER
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // MARK EMAIL AS VERIFIED
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ========== HELPER: SEND EMAIL ========== */
const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: `
        <h2>${subject}</h2>
        <p>${text}</p>
      `
    });

    return true;
  } catch (err) {
    console.error('Email send failed:', err);
    throw err;
  }
};
