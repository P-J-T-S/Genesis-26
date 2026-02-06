import mongoose from "mongoose";
import { ComplaintAgg } from "../models/complaints_agg.model.js";
import { Event } from "../models/event.model.js";
import { Alert } from "../models/alert.model.js";
import { Zone } from "../models/zone.model.js";
import { ApiError } from "../utils/apiError.js";


export const findZone = async (zone_id) => {
  const query = mongoose.Types.ObjectId.isValid(zone_id)
    ? { $or: [{ zone_id }, { _id: zone_id }] }
    : { zone_id };

  const zone = await Zone.findOne(query);
  if (!zone) {
    throw new ApiError(404, "Zone not found");
  }
  return zone;
};


export const getAllZones = async () => {
  return Zone.find({}, "zone_id zone_name _id").lean();
};

export const injectComplaint = async (zone_id, count = 10) => {
  const zone = await findZone(zone_id);

  const complaint = await ComplaintAgg.findOneAndUpdate(
    { zone_id: zone._id, time_window: "last_1hr" },
    {
      $inc: { complaint_count: count },
      $set: { spike_flag: true, timestamp: new Date() }
    },
    { upsert: true, new: true }
  );

  return { zone, complaint };
};


export const injectEvent = async ({
  zone_id,
  event_name,
  event_type = "festival",
  waste_factor = 1.5,
  duration_hours = 24
}) => {
  const zone = await findZone(zone_id);

  const now = new Date();
  const endTime = new Date(now.getTime() + duration_hours * 60 * 60 * 1000);

  const event = await Event.create({
    event_id: `evt_${Date.now()}`,
    event_name,
    zone_id: zone._id,
    event_type,
    waste_factor,
    start_time: now,
    end_time: endTime,
    active_flag: true
  });

  return { zone, event };
};


export const injectAlert = async ({
  zone_id,
  alert_type = "rain",
  severity = "medium",
  title,
  description = ""
}) => {
  const zone = await findZone(zone_id);

  const alert = await Alert.create({
    alert_id: `alert_${Date.now()}`,
    zone_id: zone._id,
    alert_type,
    severity,
    title: title || `${alert_type.toUpperCase()} Alert`,
    description,
    active_flag: true,
    timestamp: new Date()
  });

  return { zone, alert };
};