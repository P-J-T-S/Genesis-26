import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import * as signalService from "../services/signal.service.js";

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

  // TODO: Emit socket event
  // req.io.emit("signal:complaint", { zone_id: zone._id, count });

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

  // TODO: Emit socket event
  // req.io.emit("signal:event", event);

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

  // TODO: Emit socket event
  // req.io.emit("signal:alert", alert);

  return res
    .status(201)
    .json(new ApiResponse(201, alert, `Created ${severity} ${alert_type} alert in ${zone.zone_name}`));
});