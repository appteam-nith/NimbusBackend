const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({ // Corrected from userScehma to userSchema
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: false,
    unique: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  balance: {
    type: Number,
    default: 0
  },
  refreshToken: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'clubAdmin'],
    default: 'user'
  },
  transactionHistory:{
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
  },
  tasks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    default: []
  },
  correctAnswers: { 
    type: Map,
    of: Number,
    default: {}
  },
  submissionTime: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
      {
          userId: this._id,
          role: this.role,
          name: this.name,
          rollNo: this.rollNo,
          email: this.email,
          balance: this.balance,
          profilePicture: this.profilePicture,
          refreshToken: this.refreshToken,
      
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
      { userId: this._id,
        role: this.role,
  
       },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
  );
};


const User = mongoose.model('User', userSchema); // Ensure the correct schema name is passed here

module.exports = User;
