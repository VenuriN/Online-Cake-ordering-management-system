import express from "express";
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserAccount,
  getAllUsers,
  requestPasswordReset,
  verifyOTP,
  resetPassword,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin
} from "../Controllers/UserController.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Password reset routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Admin management routes
router.post("/admin", createAdmin);
router.get("/admin", getAllAdmins);
router.put("/admin/:adminId", updateAdmin);
router.delete("/admin/:adminId", deleteAdmin);

// Profile routes
router.get("/", getAllUsers);
router.get("/profile/:userId", getUserProfile);
router.put("/profile/:userId", updateUserProfile);
router.delete("/profile/:userId", deleteUserAccount);

export default router;
