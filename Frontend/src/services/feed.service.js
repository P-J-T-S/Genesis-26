import { Event } from "../models/event.model.js";
import { Alert } from "../models/alert.model.js";


export const getFeedData = async (limit = 10) => {
  const now = new Date();

  const events = await Event.find({
    active_flag: true,
    end_time: { $gte: now }
  })
    .sort({ start_time: 1 })
    .limit(limit)
    .lean();

  const alerts = await Alert.find({
    active_flag: true
  })
    .sort({ severity: -1, timestamp: -1 })
    .limit(limit)
    .lean();

  const feed = [
    ...alerts.map(a => ({
      id: a.alert_id,
      type: "alert",
      subtype: a.alert_type,
      title: a.title || `${a.alert_type.toUpperCase()} Alert`,
      description: a.description || "",
      severity: a.severity,
      zone_id: a.zone_id,
      timestamp: a.timestamp,
      priority: a.severity === "high" ? 3 : a.severity === "medium" ? 2 : 1
    })),
    ...events.map(e => ({
      id: e.event_id,
      type: "event",
      subtype: e.event_type,
      title: e.event_name,
      description: `${e.event_type} event`,
      severity: e.waste_factor > 2 ? "high" : "medium",
      zone_id: e.zone_id,
      timestamp: e.start_time,
      start_time: e.start_time,
      end_time: e.end_time,
      priority: e.waste_factor > 2 ? 3 : 2
    }))
  ];

  feed.sort((a, b) => b.priority - a.priority);

  return feed;
};