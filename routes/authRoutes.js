import express from 'express';
import { login, getProfile, updateProfile, changePassword, userRegister, userLogin, getUserProfile, updateUserProfile, uploadAvatar } from '../controllers/authController.js';
import { protectAdmin, protectUser } from '../middleware/authMiddleware.js';
import { uploadAvatarMiddleware } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Admin Auth Routes
router.post('/login', login);
router.get('/profile', protectAdmin, getProfile);
router.put('/profile', protectAdmin, updateProfile);
router.put('/change-password', protectAdmin, changePassword);

// User Auth Routes
router.post('/user/register', userRegister);
router.post('/user/login', userLogin);
router.get('/user/profile', protectUser, getUserProfile);
router.put('/user/profile', protectUser, updateUserProfile);
router.post('/user/avatar', protectUser, uploadAvatarMiddleware.single('avatar'), uploadAvatar);

export default router;
