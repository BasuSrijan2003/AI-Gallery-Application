const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // <-- 1. ADD THIS

const userSchema = new mongoose.Schema({
  // ... your existing schema fields (name, email, password, etc.)
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true 
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return; 
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- 2. ADD THIS NEW METHOD ---
userSchema.methods.getResetPasswordToken = function() {
  // Generate a raw 20-character random string
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash it securely and save it to the database model
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set the expiration timer to 15 minutes from right now
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // Return the raw, unhashed token so we can email it to the user
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);