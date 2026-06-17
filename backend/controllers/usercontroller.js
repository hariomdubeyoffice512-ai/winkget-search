const User = require('../models/User');

exports.updatePersonalInfo = async (req, res) => {
  try {
    const updateData = {};

    ['firstName', 'lastName', 'dob', 'phone'].forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (req.body.personalInfo) {
      Object.entries(req.body.personalInfo).forEach(([key, val]) => {
        updateData[`personalInfo.${key}`] = val;
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -otp -otpExpire');

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpire');
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};