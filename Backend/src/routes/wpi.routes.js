import express from 'express';
import {
  computeAllZonesWPI,
  updateZoneStatus,
  rankZonesByPriority,
} from '../services/wpi.service.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const mode = req.query.mode || 'normal';

    const zones = await computeAllZonesWPI(mode);
    const ranked = rankZonesByPriority(zones);

    res.json({
      mode,
      total_zones: ranked.length,
      zones: ranked,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/run', async (req, res, next) => {
  try {
    const mode = req.body.mode || 'normal';

    const zones = await computeAllZonesWPI(mode);
    const ranked = rankZonesByPriority(zones);

    for (const zone of ranked) {
      await updateZoneStatus(zone._id, zone, mode);
    }

    res.json({
      status: 'ok',
      message: 'Zone WPI computed and stored',
      mode,
      zones_updated: ranked.length,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
