import express from 'express';
import { Zone } from '../models/zone.model.js';
import { ZoneStatus } from '../models/zone_status.model.js';
import {
  generateAndSaveRecommendations,
  getRecentRecommendations,
} from '../services/recommendation.service.js';

const router = express.Router();

router.post('/run', async (req, res, next) => {
  try {
    const mode = req.body.mode || 'normal';

    const zones = await Zone.find({});
    let totalGenerated = 0;

    for (const zone of zones) {
      const status = await ZoneStatus.findOne({ zone_id: zone._id });

      if (!status) continue;

      const saved = await generateAndSaveRecommendations(
        zone._id,
        status.wpi_score,
        status.signals || {},
        mode
      );

      totalGenerated += saved.length;
    }

    res.json({
      status: 'ok',
      message: 'Recommendations generated',
      total_recommendations: totalGenerated,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:zoneId', async (req, res, next) => {
  try {
    const { zoneId } = req.params;
    const limit = Number(req.query.limit) || 5;

    const recommendations = await getRecentRecommendations(zoneId, limit);

    res.json({
      zone_id: zoneId,
      count: recommendations.length,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
