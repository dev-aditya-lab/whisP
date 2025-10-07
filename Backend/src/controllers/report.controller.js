import Report from "../models/Report.models.js";
import User from "../models/User.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// POST /report
export const reportUser = asyncHandler(async (req, res) => {
    const reporterId = req.user._id; // Authenticated user
    const { reportedId, reason } = req.body;

    if (!reportedId) throw new ApiError(400, "reportedId is required");

    if (reporterId === reportedId)
        throw new ApiError(400, "You cannot report yourself");

    // Check if reported user exists
    const reportedUser = await User.findById(reportedId);
    if (!reportedUser) throw new ApiError(404, "Reported user not found");

    // Create a report
    await Report.create({
        reporterId,
        reportedId,
        reason: reason || "No reason provided",
    });

    // Increment reports count
    reportedUser.reports += 1;

    // Block user if reports >= 3
    if (reportedUser.reports >= 3) {
        reportedUser.blocked = true;
    }

    await reportedUser.save();

    return res.status(200).json(
        new ApiResponse(200, { reports: reportedUser.reports, blocked: reportedUser.blocked }, "User reported successfully")
    );
});
