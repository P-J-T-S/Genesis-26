import { Router } from 'express';
import {
  getAllZones,
  getZonesStatus,
  getZoneDetail,
  switchMode,
  getDashboardSummary,
} from '../controllers/zones.controller.js';

const router = Router();

// GET all zones with geometry
router.get('/', getAllZones);

// GET all zones with status (for map)
router.get('/status', getZonesStatus);

// GET zone detail with breakdown
router.get('/:id', getZoneDetail);

// POST switch mode
router.post('/mode', switchMode);

// GET dashboard summary
router.get('/dashboard/summary', getDashboardSummary);

export default router;
