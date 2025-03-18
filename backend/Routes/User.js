import express from 'express';
import { updateUser, deleteUser, getUserProfile } from '../Controllers/UserController.js';
import { VerifyToken } from '../Utils/VerifyToken.js';

const router = express.Router();

router.put('/update', VerifyToken, updateUser);
router.delete('/delete', VerifyToken, deleteUser);
router.get('/profile', VerifyToken, getUserProfile);


export default router;
