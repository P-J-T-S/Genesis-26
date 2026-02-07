// Backend/src/services/priority.service.js
import { ZoneStatus } from '../models/zone_status.model.js';

export const getTopPriorityZones = async (limit = 5) => {
  const priorityZones = await ZoneStatus.find()
    .populate('zone_id')
    .sort({ wpi_score: -1, priority_rank: 1 })
    .limit(limit)
    .lean();

  return priorityZones.map(z => ({
    zone_id: z.zone_id,
    wpi_score: z.wpi_score,
    status_color: z.status_color,
    priority_rank: z.priority_rank,
    updated_at: z.updated_at,
    critical: z.wpi_score >= 75,
    actionable: z.actionable_signals ? Object.values(z.actionable_signals).some(v => v) : false,
    wpiBreakdown: [
      { key: 'complaint_intensity', label: 'Complaint Intensity', contribution: Math.round(0.4 * (z.signals?.complaint_intensity || 0)) },
      { key: 'event_presence', label: 'Event Presence', contribution: Math.round(0.2 * (z.signals?.event_presence || 0)) },
      { key: 'hotspot_history', label: 'Hotspot History', contribution: Math.round(0.2 * (z.signals?.hotspot_history || 0)) },
      { key: 'weather_alert', label: 'Weather Alert', contribution: Math.round(0.1 * (z.signals?.weather_alert || 0)) },
      { key: 'spike_flag', label: 'Complaint Spike', contribution: Math.round(0.1 * (z.signals?.spike_flag ? 100 : 0)) }
    ],
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
