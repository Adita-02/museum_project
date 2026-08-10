import express from 'express';
import { signupUser, loginUser, updateProfile } from '../controllers/authController.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.put('/profile', verifyAdmin, updateProfile);

export default router;