import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import * as signalService from "../services/signal.service.js";
import { emitSignal, emitZoneUpdate } from "../socket/socket.js";

export const getZones = asyncHandler(async (req, res) => {
  const zones = await signalService.getAllZones();
  return res
    .status(200)
    .json(new ApiResponse(200, { zones }, "Zones fetched"));
});

export const injectComplaint = asyncHandler(async (req, res) => {
  const { zone_id, count = 10 } = req.body;

  if (!zone_id) {
    throw new ApiError(400, "zone_id is required");
  }

  const { zone, complaint } = await signalService.injectComplaint(zone_id, count);

  // Emit real-time event
  emitSignal("complaint", { 
    zone_id: zone._id, 
    zone_name: zone.zone_name,
    count,
    spike_flag: complaint.spike_flag 
  });

  return res
    .status(201)
    .json(new ApiResponse(201, complaint, `Injected ${count} complaints to ${zone.zone_name}`));
});

export const injectEvent = asyncHandler(async (req, res) => {
  const { zone_id, event_name, event_type, waste_factor, duration_hours } = req.body;

  if (!zone_id || !event_name) {
    throw new ApiError(400, "zone_id and event_name are required");
  }

  const { zone, event } = await signalService.injectEvent({
    zone_id,
    event_name,
    event_type,
    waste_factor,
    duration_hours
  });

  // Emit real-time event
  emitSignal("event", { 
    zone_id: zone._id, 
    zone_name: zone.zone_name,
    event_name: event.event_name,
    event_type: event.event_type,
    waste_factor: event.waste_factor
  });

  return res
    .status(201)
    .json(new ApiResponse(201, event, `Created event "${event_name}" in ${zone.zone_name}`));
});

export const injectAlert = asyncHandler(async (req, res) => {
  const { zone_id, alert_type, severity, title, description } = req.body;

  if (!zone_id) {
    throw new ApiError(400, "zone_id is required");
  }

  const { zone, alert } = await signalService.injectAlert({
    zone_id,
    alert_type,
    severity,
    title,
    description
  });

  // Emit real-time event
  emitSignal("alert", { 
    zone_id: zone._id, 
    zone_name: zone.zone_name,
    alert_type: alert.alert_type,
    severity: alert.severity,
    title: alert.title
  });

  return res
    .status(201)
    .json(new ApiResponse(201, alert, `Created ${severity} ${alert_type} alert in ${zone.zone_name}`));
});