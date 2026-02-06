
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import * as priorityService from "../services/priority.service.js";

export const getPriorityZones = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const priorityZones = await priorityService.getTopPriorityZones(limit);

  return res
    .status(200)
    .json(new ApiResponse(200, { count: priorityZones.length, priority_zones: priorityZones }, "Priority zones fetched"));
});