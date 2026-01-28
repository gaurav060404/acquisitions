import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { signupSchema } from "../validations/auth.validation.js";
import { formatValidationError } from "../utils/format.js";

export const signup = asyncHandler((req, res) => {
  const validationResult = signupSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ApiError(
      400,
      "Validation failed",
      formatValidationError(validationResult.error),
    );
  }
});
