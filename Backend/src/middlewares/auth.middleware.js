import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.headers.authorization?.split(" ")[1]; // Bearer token

    if (!token) throw new ApiError(401, "No token provided");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // should contain _id and other claims
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }
});

export default verifyJWT;