import express from "express";
import ApiResponse from "./utils/ApiResponse.js";
import logger from "#config/logger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
app.use(cookieParser());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const errors = err.errors || [];

  res.status(statusCode).json(new ApiResponse(statusCode, errors, message));
});

app.get("/", (req, res) => {
  logger.info("Hello from the api");
  res
    .status(200)
    .json(new ApiResponse(200, null, "This is backend for Acquisitions"));
});

app.get("/api/health", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      "Server is runnning....",
    ),
  );
});

app.get("/api", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, null, "Acquisitions Api is runnning...."));
});

app.use("/api/auth", authRouter);

export default app;
