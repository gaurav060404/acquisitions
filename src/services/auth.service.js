import logger from "#config/logger.js";
import ApiError from "#utils/ApiError.js";
import bcrypt from "bcrypt";
import { db } from "#config/database.js";
import { eq } from "drizzle-orm";
import { users } from "#models/user.model.js";

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error("Error while hashing the password: " + error);
    throw new ApiError(400, "Error hashing");
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error("Error while comparing password: " + error);
    throw new ApiError(400, "Error comparing password");
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    logger.info(`User ${user.email} authenticated successfully`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error("Error while authenticating user: " + error);
    throw new ApiError(401, "Authentication failed");
  }
};

export const createUser = async ({ name, email, password, role = "user" }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) throw new ApiError(400, "User already exists");

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.created_at,
      });
    logger.info(`User ${newUser.email} created successfully`);
    return newUser;
  } catch (error) {
    logger.error("Error while creating the user: " + error);
    throw new ApiError(400, "Error during user creation");
  }
};
