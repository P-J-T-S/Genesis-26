// Backend/src/services/priority.service.js
import { ZoneStatus } from '../models/zone_status.model.js';

export const getTopPriorityZones = async (limit = 5) => {
  const priorityZones = await ZoneStatus.find()
    .populate('zone_id')
    .sort({ wpi: -1, priority_rank: 1 })
    .limit(limit)
    .lean();

  return priorityZones.map(z => ({
    zone_id: z.zone_id,
    wpi: z.wpi,
    color: z.color,
    priority_rank: z.priority_rank,
    updated_at: z.updated_at,
    critical: z.wpi >= 75,
    actionable: z.actionable_signals ? Object.values(z.actionable_signals).some(v => v) : false
  }));
};

export const getPriorityDistribution = async () => {
  const distribution = await ZoneStatus.aggregate([
    {
      $group: {
        _id: '$color',
        count: { $sum: 1 }
      }
    }
  ]);

  return Object.fromEntries(distribution.map(d => [d._id, d.count]));
};
