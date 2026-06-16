const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ['personal', 'business'],
    default: 'personal',
  },
  otp: {
    type: String,
  },
  otpExpire: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  personalInfo: {
    homeAddress: { type: String, default: '' },
    workAddress: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    gender: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
}, { timestamps: true });

// Email auto generate
userSchema.pre('save', async function () {
  if (this.isModified('username')) {
    this.email = `${this.username}@winkget.com`;
  }
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);