import {
  generateAndSaveRecommendations,
  getRecentRecommendations,
} from '../services/recommendation.service.js';
import { Zone } from '../models/zone.model.js';
import { ZoneStatus } from '../models/zone_status.model.js';
import { ComplaintAgg } from '../models/complaints_agg.model.js';
import { Event } from '../models/event.model.js';
import { Alert } from '../models/alert.model.js';
import { Recommendation } from '../models/recommendation.model.js';
import {
  computeZoneWPI,
  computeAllZonesWPI,
  updateZoneStatus,
  rankZonesByPriority,
} from '../services/wpi.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { emitModeChange } from "../socket/socket.js";


// Global mode variable (in production, store in DB or Redis)
let globalMode = 'normal';


export const getAllZones = asyncHandler(async (req, res) => {
  const zones = await Zone.find({}).select('zone_id zone_name geojson is_hotspot');
  
  // Optional: Enrich with credit status
  const enrichedZones = await Promise.all(
    zones.map(async (zone) => {
      const credit = await ZoneCreditRanking.findOne({ zone_id: zone._id });
      return {
        ...zone.toObject(),
        zone_status: credit?.zone_status || null,
        credit_score: credit?.credit_score || null
      };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, enrichedZones, 'Zones retrieved successfully')
  );
});


export const getZonesStatus = asyncHandler(async (req, res) => {
  const zonesWithWPI = await computeAllZonesWPI(globalMode);

  // Rank by priority
  const rankedZones = rankZonesByPriority(zonesWithWPI);

  // Save/update to DB (for persistence)
  for (const zone of rankedZones) {
    await updateZoneStatus(zone._id, zone, globalMode);
  }

  return res.status(200).json(
    new ApiResponse(200, {
      mode: globalMode,
      zones: rankedZones,
      timestamp: new Date(),
    }, 'Zone status retrieved successfully')
  );
});

export const getZoneDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch zone
  const zone = await Zone.findById(id);
  if (!zone) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Zone not found')
    );
  }

  // Compute WPI + signals
  const wpiData = await computeZoneWPI(id, globalMode);

  // **Task 4a: Save/update ZoneStatus to DB for persistence & fallback**
const zoneStatus = await ZoneStatus.findOneAndUpdate(
  { zone_id: id },
  {
    zone_id: id,
    wpi_score: wpiData.wpi_score,
    status_color: wpiData.status_color,
    blink_flag: wpiData.blink_flag,
    mode: globalMode,
    signals: wpiData.signals,
    last_updated: new Date(),
  },
  { upsert: true, new: true }
);

  // Fetch recent complaints
  const recentComplaints = await ComplaintAgg.findOne({
    zone_id: id,
    time_window: 'last_12hrs',
  }).sort({ timestamp: -1 });

  // Fetch active/upcoming events
  const now = new Date();
  const events = await Event.find({
    zone_id: id,
    active_flag: true,
    $or: [
      { start_time: { $lte: now }, end_time: { $gte: now } },
      { start_time: { $gt: now, $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) } },
    ],
  }).limit(5);

  // Fetch active alerts
  const alerts = await Alert.find({
    zone_id: id,
    active_flag: true,
  }).sort({ timestamp: -1 }).limit(5);

  // Generate fresh recommendations based on current WPI
  const freshRecommendations = await generateAndSaveRecommendations(
    id,
    wpiData.wpi_score,
    wpiData.signals,
    globalMode
  );

  // Use fresh recommendations, fallback to DB if none generated
  const recommendations = freshRecommendations && freshRecommendations.length > 0
    ? freshRecommendations
    : await getRecentRecommendations(id, 5);

  // Build explainability breakdown
  const breakdown = {
    complaint_intensity: wpiData.signals.complaint_intensity,
    event_presence: wpiData.signals.event_presence,
    hotspot_history: wpiData.signals.hotspot_history,
    weather_alert: wpiData.signals.weather_alert,
    spike_flag: wpiData.signals.spike_flag,
  };

  return res.status(200).json(
    new ApiResponse(200, {
      zone: {
        _id: zone._id,
        zone_id: zone.zone_id,
        zone_name: zone.zone_name,
        geojson: zone.geojson,
        is_hotspot: zone.is_hotspot,
      },
      status: {
        wpi_score: wpiData.wpi_score,
        status_color: wpiData.status_color,
        blink_flag: wpiData.blink_flag,
        mode: globalMode,
      },
      breakdown,
      signals: {
        recent_complaints: recentComplaints,
        active_events: events,
        active_alerts: alerts,
      },
      recommendations,
          last_updated: zoneStatus.last_updated,
    }, 'Zone detail retrieved successfully')
  );
});


export const switchMode = asyncHandler(async (req, res) => {
  const { mode } = req.body;

  if (!['normal', 'event', 'emergency'].includes(mode)) {
    return res.status(400).json(
      new ApiResponse(400, null, 'Invalid mode. Must be normal, event, or emergency')
    );
  }

  globalMode = mode;

  // Recompute all zones
  const zonesWithWPI = await computeAllZonesWPI(mode);
  const rankedZones = rankZonesByPriority(zonesWithWPI);

  // Update DB
  for (const zone of rankedZones) {
    await updateZoneStatus(zone._id, zone, mode);
  }

  emitModeChange(mode, rankedZones);

  return res.status(200).json(
    new ApiResponse(200, {
      mode: globalMode,
      zones_updated: rankedZones.length,
      zones: rankedZones,
    }, `Mode switched to ${mode}`)
  );
});


export const getDashboardSummary = asyncHandler(async (req, res) => {
  const zonesWithWPI = await computeAllZonesWPI(globalMode);
  const rankedZones = rankZonesByPriority(zonesWithWPI);

  // Get top 5
  const topCritical = rankedZones.slice(0, 5);

  // Count by color
  const colorCounts = {
    green: rankedZones.filter(z => z.status_color === 'green').length,
    yellow: rankedZones.filter(z => z.status_color === 'yellow').length,
    orange: rankedZones.filter(z => z.status_color === 'orange').length,
    red: rankedZones.filter(z => z.status_color === 'red').length,
  };

  // Count blinking zones
  const blinkingCount = rankedZones.filter(z => z.blink_flag).length;

  return res.status(200).json(
    new ApiResponse(200, {
      mode: globalMode,
      total_zones: rankedZones.length,
      top_critical: topCritical,
      color_counts: colorCounts,
      blinking_zones: blinkingCount,
      timestamp: new Date(),
    }, 'Dashboard summary retrieved successfully')
  );
});
