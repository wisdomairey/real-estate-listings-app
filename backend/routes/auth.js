import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validateLogin } from '../middleware/validation.js';
import {
  login,
  getMe,
  logout,
  verifyToken,
  changePassword
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/login', validateLogin, login);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/me', getMe);
router.post('/logout', logout);
router.get('/verify', verifyToken);
router.put('/change-password', changePassword);

export default router;
