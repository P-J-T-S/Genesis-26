import { Officer } from "../models/officer.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
};

// Generate tokens helper
const generateTokens = async (officerId) => {
    const officer = await Officer.findById(officerId);
    const accessToken = officer.generateAccessToken();
    const refreshToken = officer.generateRefreshToken();

    officer.refreshToken = refreshToken;
    await officer.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

// Register (Signup)
export const register = asyncHandler(async (req, res) => {
    const { name, ward_id, login_id, password } = req.body;

    // Validation
    if (!name || !login_id || !password) {
        throw new ApiError(400, "Name, login_id and password are required");
    }

    // Check if officer exists
    const existingOfficer = await Officer.findOne({ login_id });

    if (existingOfficer) {
        throw new ApiError(409, "Officer with this login_id already exists");
    }

    // Create officer
    const officer = await Officer.create({
        name,
        ward_id: ward_id || null,
        login_id,
        password_hash: password,
        is_active: true,
    });

    const createdOfficer = await Officer.findById(officer._id).select("-password_hash -refreshToken");

    res.status(201).json(new ApiResponse(201, createdOfficer, "Officer registered successfully"));
});

// Login
export const login = asyncHandler(async (req, res) => {
    const { login_id, password } = req.body;

    if (!login_id || !password) {
        throw new ApiError(400, "Login ID and password are required");
    }

    const officer = await Officer.findOne({ login_id });

    if (!officer) {
        throw new ApiError(401, "Invalid login_id or password");
    }

    if (!officer.is_active) {
        throw new ApiError(403, "Account is disabled. Contact administrator.");
    }

    const isPasswordValid = await officer.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid login_id or password");
    }

    const { accessToken, refreshToken } = await generateTokens(officer._id);

    const loggedInOfficer = await Officer.findById(officer._id).select("-password_hash -refreshToken");

    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { officer: loggedInOfficer, accessToken, refreshToken }, "Logged in successfully"));
});

// Logout
export const logout = asyncHandler(async (req, res) => {
    await Officer.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1 },
    });

    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// Refresh token
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token required");
    }

    const jwt = await import("jsonwebtoken");
    const decoded = jwt.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const officer = await Officer.findById(decoded._id);

    if (!officer || officer.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateTokens(officer._id);

    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed"));
});