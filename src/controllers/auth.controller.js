import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { signupSchema, signinSchema } from "../validations/auth.validation.js";
import { formatValidationError } from "../utils/format.js";
import { createUser, authenticateUser } from "#services/auth.service.js";
import logger from "#config/logger.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const signup = asyncHandler(async (req, res) => {
  const validationResult = signupSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ApiError(
      400,
      "Validation failed",
      formatValidationError(validationResult.error),
    );
  }

  const { name, email, password, role } = validationResult.data;

  const user = await createUser({ name, email, password, role });

  const token = jwttoken.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  cookies.set(res, "token", token);
  logger.info(`User registered successfully: ${email}`);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      "User registered successfully",
    ),
  );
});

export const signin = asyncHandler(async (req, res) => {
  const validationResult = signinSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ApiError(
      400,
      "Validation failed",
      formatValidationError(validationResult.error),
    );
  }

  const { email, password } = validationResult.data;

  const user = await authenticateUser({ email, password });

  const token = jwttoken.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  cookies.set(res, "token", token);
  logger.info(`User signed in successfully: ${email}`);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "User signed in successfully",
    ),
  );
});

export const signout = asyncHandler(async (req, res) => {
  cookies.clear(res, "token");
  logger.info("User signed out successfully");

  res.status(200).json(new ApiResponse(200, null, "Signed out successfully"));
});
