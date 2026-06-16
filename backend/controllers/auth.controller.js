const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { firstName, lastName, username, dob, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username === username
          ? 'Username already taken'
          : 'Phone number already registered',
      });
    }

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      firstName,
      lastName,
      username: username.toLowerCase(),
      dob,
      phone,
      password,
      otp,
      otpExpire,
    });

    await user.save();

    console.log(`📱 OTP for ${phone}: ${otp}`);

    res.status(201).json({
      success: true,
      message: `OTP sent to ${phone}`,
      userId: user._id,
      devOTP: otp,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (user.otpExpire < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired — please register again',
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { email: identifier },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this phone/email',
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your phone number first',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, verifyOTP, login };