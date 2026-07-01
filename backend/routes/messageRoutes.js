import express from 'express';
import { createMessage, getMessages } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route to submit a contact message
router.post('/', createMessage);

// Protected route to fetch messages for admin
router.get('/', authenticateToken, getMessages);

export default router;
