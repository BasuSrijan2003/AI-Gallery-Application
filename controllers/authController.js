const User = require('../models/User');

// ==========================================
// 1. REGISTER USER
// ==========================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log("Error in registerUser:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ==========================================
// 2. LOGIN USER
// ==========================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ==========================================
// 3. FORGOT / RESET PASSWORD
// ==========================================
const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Replace the old password with the new one. 
    // Your User.js model will automatically scramble this new password before saving it!
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// ==========================================
// 4. LOGOUT USER
// ==========================================
const logoutUser = (req, res) => {
  // Because you are not using JWTs or backend sessions, logout is just a confirmation.
  // Your frontend application will handle the actual logout by clearing its local storage.
  res.status(200).json({ message: "Logged out successfully!" });
};

module.exports = { registerUser, loginUser, forgotPassword, logoutUser };