// Backend/src/services/signal.service.js
import { Zone } from '../models/zone.model.js';
import { ComplaintAgg } from '../models/complaints_agg.model.js';
import { Event } from '../models/event.model.js';
import { Alert } from '../models/alert.model.js';

export const getAllZones = async () => {
  return await Zone.find({}).select('zone_id zone_name geojson is_hotspot');
};

export const injectComplaint = async (zone_id, count = 10) => {
  const zone = await Zone.findById(zone_id);
  if (!zone) throw new Error('Zone not found');

  const complaint = await ComplaintAgg.create({
    zone_id: zone._id,
    time_window: 'last_6hrs',
    complaint_count: count,
    avg_daily_count: Math.floor(count / 2),
    spike_flag: count > 30,
    timestamp: new Date(),
  });

  return { zone, complaint };
};

export const injectEvent = async (data) => {
  const zone = await Zone.findById(data.zone_id);
  if (!zone) throw new Error('Zone not found');

  const event = await Event.create({
    event_name: data.event_name,
    zone_id: zone._id,
    event_type: data.event_type || 'other',
    start_time: new Date(),
    end_time: new Date(Date.now() + (data.duration_hours || 6) * 60 * 60 * 1000),
    active_flag: true,
  });

  return { zone, event };
};

export const injectAlert = async (data) => {
  const zone = await Zone.findById(data.zone_id);
  if (!zone) throw new Error('Zone not found');

  const alert = await Alert.create({
    zone_id: zone._id,
    alert_type: data.alert_type || 'other',
    severity: data.severity || 'medium',
    active_flag: true,
    timestamp: new Date(),
  });

  return { zone, alert };
};
