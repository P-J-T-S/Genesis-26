import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Officer } from "../models/officer.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request!");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const officer = await Officer.findById(decodedToken?._id).select(
      "-password_hash -refreshToken"
    );

    if (!officer) {
      throw new ApiError(401, "Invalid access token");
    }

    if (!officer.is_active) {
      throw new ApiError(403, "Account is disabled");
    }

    req.user = officer;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token!");
  }
});