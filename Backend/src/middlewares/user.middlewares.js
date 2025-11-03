import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.models.js";

export const VerifyUser = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select(
      "-password -emailVerificationToken -forgotPasswordToken"
    );

    if (!user) throw new ApiError(401, "Unauthorized request");

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Unauthorized request");
  }
};

export const VerifyAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: admin access required");
  }

  if (!req.user.isEmailVerified) {
    throw new ApiError(403, "Email verification required for admin access");
  }
  next();
};
