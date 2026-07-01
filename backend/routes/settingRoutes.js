import express from 'express';
import { getPortfolio, updateSettings } from '../controllers/settingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/portfolio', getPortfolio);
router.put('/settings', authenticateToken, updateSettings);

export default router;
