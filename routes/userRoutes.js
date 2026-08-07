import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getReviewers } from '../controllers/userController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protectAdmin, getAllUsers);
router.get('/reviewers', protectAdmin, getReviewers);
router.get('/:id', protectAdmin, getUserById);
router.post('/', protectAdmin, createUser);
router.put('/:id', protectAdmin, updateUser);
router.delete('/:id', protectAdmin, deleteUser);

export default router;
