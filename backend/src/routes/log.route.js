
import { getRecentLogs } from '../middlewares/log.js';
import express from 'express';
const router = express.Router();


router.get('/logs/recent', (req, res) => {
  res.json(getRecentLogs());
});

export default router;