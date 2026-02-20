const User = require('./user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      gender,
      password
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !gender ||
      !password
    ) {
      return res.status(400).json({
        message: 'All fields required'
      });
    }

    const existing =
      await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      gender,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Registered successfully',
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;



    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }



    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials'
      });
    }



    // TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );



    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {

    const user = await User
      .findById(req.user.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message:
        'Password reset link sent to your email (demo)'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error'
    });
  }
};