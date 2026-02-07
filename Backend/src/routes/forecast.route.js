import express from 'express';
import { forecastZone } from '../controllers/forecast.controller.js';

const router = express.Router();

/**
 * POST /api/v1/forecast
 * body: { date, ward, zone, mode }
 */
router.post('/', forecastZone);

export default router;
