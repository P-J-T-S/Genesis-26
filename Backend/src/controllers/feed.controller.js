import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import * as feedService from "../services/feed.service.js";


export const getFeed = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const feed = await feedService.getFeedData(limit);

  return res
    .status(200)
    .json(new ApiResponse(200, { count: feed.length, feed }, "Feed fetched successfully"));
});