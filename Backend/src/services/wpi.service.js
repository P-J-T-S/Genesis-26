import { Zone } from '../models/zone.model.js';
import { ComplaintAgg } from '../models/complaints_agg.model.js';
import { Event } from '../models/event.model.js';
import { Alert } from '../models/alert.model.js';
import { ZoneStatus } from '../models/zone_status.model.js';
import { modeConfig, getColorByWPI, shouldBlink } from '../config/modeConfig.js';


const normalize = (value, min = 0, max = 100) => {
  if (max === min) return 0;
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized));
};


const getComplaintIntensity = async (zoneId) => {
  try {
    const recent = await ComplaintAgg.findOne({
      zone_id: zoneId,
      time_window: 'last_12hrs',
    }).sort({ timestamp: -1 });

    if (!recent) return 0;

    const intensity = normalize(recent.complaint_count, 0, 50);
    return intensity;
  } catch (error) {
    console.error('Error fetching complaint intensity:', error);
    return 0;
  }
};


const getEventPresence = async (zoneId) => {
  try {
    const now = new Date();
    const activeEvent = await Event.findOne({
      zone_id: zoneId,
      start_time: { $lte: now },
      end_time: { $gte: now },
      active_flag: true,
    });

    if (activeEvent) return 80; // High signal for active event
    
    // Check upcoming events (next 24 hours)
    const upcomingEvent = await Event.findOne({
      zone_id: zoneId,
      start_time: { $gt: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
      active_flag: true,
    });

    return upcomingEvent ? 40 : 0; // Medium signal for upcoming
  } catch (error) {
    console.error('Error fetching event presence:', error);
    return 0;
  }
};


const getHotspotHistory = async (zoneId) => {
  try {
    const zone = await Zone.findById(zoneId);
    return zone?.is_hotspot ? 60 : 0; // 60% signal if flagged as hotspot
  } catch (error) {
    console.error('Error fetching hotspot history:', error);
    return 0;
  }
};


const getWeatherAlertSignal = async (zoneId) => {
  try {
    const activeAlerts = await Alert.find({
      zone_id: zoneId,
      active_flag: true,
    });

    if (!activeAlerts.length) return 0;

    // Score based on severity
    let score = 0;
    activeAlerts.forEach((alert) => {
      if (alert.severity === 'high') score += 40;
      else if (alert.severity === 'medium') score += 25;
      else score += 10;
    });

    return Math.min(100, score); // Cap at 100
  } catch (error) {
    console.error('Error fetching alert signal:', error);
    return 0;
  }
};


const getSpikeFlag = async (zoneId) => {
  try {
    const recent = await ComplaintAgg.findOne({
      zone_id: zoneId,
      time_window: 'last_6hrs',
    }).sort({ timestamp: -1 });

    if (!recent) return 0;

    return recent.spike_flag ? 100 : 0;
  } catch (error) {
    console.error('Error fetching spike flag:', error);
    return 0;
  }
};


export const computeZoneWPI = async (zoneId, mode = 'normal') => {
  const config = modeConfig[mode] || modeConfig.normal;

  // Fetch all signals in parallel
  const [
    complaint_intensity,
    event_presence,
    hotspot_history,
    weather_alert,
    spike_flag,
  ] = await Promise.all([
    getComplaintIntensity(zoneId),
    getEventPresence(zoneId),
    getHotspotHistory(zoneId),
    getWeatherAlertSignal(zoneId),
    getSpikeFlag(zoneId),
  ]);

  // Apply weights
  const wpi_score =
    config.weights.complaint_intensity * complaint_intensity +
    config.weights.event_presence * event_presence +
    config.weights.hotspot_history * hotspot_history +
    config.weights.weather_alert * weather_alert +
    config.weights.spike_flag * spike_flag;

  const status_color = getColorByWPI(Math.round(wpi_score), mode);
  const blink_flag = shouldBlink(Math.round(wpi_score), mode);

  return {
    wpi_score: Math.round(wpi_score),
    status_color,
    blink_flag,
    signals: {
      complaint_intensity: Math.round(complaint_intensity),
      event_presence: Math.round(event_presence),
      hotspot_history: Math.round(hotspot_history),
      weather_alert: Math.round(weather_alert),
      spike_flag: spike_flag > 0,
    },
  };
};


export const computeAllZonesWPI = async (mode = 'normal') => {
  try {
    const zones = await Zone.find({});
    const results = [];

    for (const zone of zones) {
      const wpiData = await computeZoneWPI(zone._id, mode);
      results.push({
        _id: zone._id,
        zone_id: zone.zone_id,
        zone_name: zone.zone_name,
        geojson: zone.geojson,
        ...wpiData,
      });
    }

    return results;
  } catch (error) {
    console.error('Error computing all zones WPI:', error);
    return [];
  }
};


export const updateZoneStatus = async (zoneId, wpiData, mode) => {
  try {
    const updated = await ZoneStatus.findOneAndUpdate(
      { zone_id: zoneId },
      {
        wpi_score: wpiData.wpi_score,
        status_color: wpiData.status_color,
        blink_flag: wpiData.blink_flag,
        mode,
        last_updated: new Date(),
      },
      { upsert: true, new: true }
    );

    return updated;
  } catch (error) {
    console.error('Error updating zone status:', error);
    return null;
  }
};


export const rankZonesByPriority = (zones) => {
  return zones
    .sort((a, b) => b.wpi_score - a.wpi_score)
    .map((zone, index) => ({
      ...zone,
      priority_rank: index + 1,
    }));
};