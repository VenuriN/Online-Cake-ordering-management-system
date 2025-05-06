import User from "../models/User.js";
import response from "../Utils/ResponseHandler/ResponseHandler.js";
import HttpType from "../Utils/ResponseHandler/HttpType.js";
import ResTypes from "../Utils/ResponseHandler/ResTypes.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, HttpType.BAD_REQUEST.code, ResTypes.errors.user_exists);
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password, // In a real app, you should hash this password
      phone
    });
    
    await newUser.save();
    
    // Remove password from response
    const userWithoutPassword = { ...newUser._doc };
    delete userWithoutPassword.password;
    
    return response(res, HttpType.CREATED.code, {
      message: ResTypes.successMessages.user_created.message,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Registration error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    // Check password
    if (user.password !== password) { // In a real app, you should compare hashed passwords
      return response(res, HttpType.UNAUTHORIZED.code, ResTypes.errors.invalid_password);
    }
    
    // Remove password from response
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    
    return response(res, HttpType.OK.code, {
      message: ResTypes.successMessages.login_successful.message,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Login error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    // Remove password from response
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    
    return response(res, HttpType.OK.code, {
      message: ResTypes.successMessages.data_retrieved.message,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const userObj = { ...user._doc };
      delete userObj.password;
      return userObj;
    });
    
    return response(res, HttpType.OK.code, {
      message: ResTypes.successMessages.data_retrieved.message,
      users: usersWithoutPasswords
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // Don't allow role updates through this endpoint
    delete updateData.role;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedUser) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    // Remove password from response
    const userWithoutPassword = { ...updatedUser._doc };
    delete userWithoutPassword.password;
    
    return response(res, HttpType.OK.code, {
      message: ResTypes.successMessages.user_edited.message,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.upadate_error);
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    return response(res, HttpType.OK.code, {
      message: "User account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.delete_error);
  }
};


// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiration (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    // Save OTP and expiration to user
    user.passwordResetOTP = {
      code: otp,
      expiresAt
    };
    await user.save();
    
    // Send email with OTP
    await sendPasswordResetEmail(email, otp);
    
    return response(res, HttpType.OK.code, ResTypes.successMessages.verify_password);
  } catch (error) {
    console.error("Password reset request error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    // Check if OTP exists and is not expired
    if (!user.passwordResetOTP || !user.passwordResetOTP.code) {
      return response(res, HttpType.BAD_REQUEST.code, ResTypes.errors.invalid_code);
    }
    
    // Check if OTP is expired
    if (new Date() > new Date(user.passwordResetOTP.expiresAt)) {
      return response(res, HttpType.BAD_REQUEST.code, { message: "OTP has expired" });
    }
    
    // Check if OTP matches
    if (user.passwordResetOTP.code !== otp) {
      return response(res, HttpType.BAD_REQUEST.code, ResTypes.errors.invalid_code);
    }
    
    return response(res, HttpType.OK.code, { message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    // Check if OTP exists and is not expired
    if (!user.passwordResetOTP || !user.passwordResetOTP.code) {
      return response(res, HttpType.BAD_REQUEST.code, ResTypes.errors.invalid_code);
    }
    
    // Check if OTP is expired
    if (new Date() > new Date(user.passwordResetOTP.expiresAt)) {
      return response(res, HttpType.BAD_REQUEST.code, { message: "OTP has expired" });
    }
    
    // Check if OTP matches
    if (user.passwordResetOTP.code !== otp) {
      return response(res, HttpType.BAD_REQUEST.code, ResTypes.errors.invalid_code);
    }
    
    // Update password
    user.password = newPassword; // In a real app, you should hash this password
    user.passwordResetOTP = { code: null, expiresAt: null };
    await user.save();
    
    return response(res, HttpType.OK.code, ResTypes.successMessages.password_reseted);
  } catch (error) {
    console.error("Password reset error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

// Admin management functions
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return response(res, HttpType.BAD_REQUEST.code, ResTypes.errors.user_exists);
    }
    
    // Create new admin
    const newAdmin = new User({
      name,
      email,
      password, // In a real app, you should hash this password
      phone,
      role: 'admin'
    });
    
    await newAdmin.save();
    
    // Remove password from response
    const adminWithoutPassword = { ...newAdmin._doc };
    delete adminWithoutPassword.password;
    
    return response(res, HttpType.CREATED.code, {
      message: "Admin created successfully",
      admin: adminWithoutPassword
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.create_error);
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    
    return response(res, HttpType.OK.code, {
      message: ResTypes.successMessages.data_retrieved.message,
      admins
    });
  } catch (error) {
    console.error("Get all admins error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.server_error);
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const updateData = req.body;
    
    // Don't allow role changes
    delete updateData.role;
    
    const updatedAdmin = await User.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!updatedAdmin) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    return response(res, HttpType.OK.code, {
      message: "Admin updated successfully",
      admin: updatedAdmin
    });
  } catch (error) {
    console.error("Update admin error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.upadate_error);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    
    const deletedAdmin = await User.findOneAndDelete({ _id: adminId, role: 'admin' });
    
    if (!deletedAdmin) {
      return response(res, HttpType.NOT_FOUND.code, ResTypes.errors.no_user);
    }
    
    return response(res, HttpType.OK.code, {
      message: "Admin deleted successfully"
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    return response(res, HttpType.INTERNAL_SERVER_ERROR.code, ResTypes.errors.delete_error);
  }
};
