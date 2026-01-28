import logger from "#config/logger.js";
import jwt from "jsonwebtoken";
import ApiError from "./ApiError.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";
const JWT_EXPIRES_IN = "1d";

export const jwttoken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error("Failed to authenticate token", error);
      throw new ApiError(401, "Failed to authenticate");
    }
  },
  verify: (token) => {
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error("Failed to authenticate token", error);
      throw new ApiError(401, "Failed to authenticate");
    }
  },
};
