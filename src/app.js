import express from "express";
import ApiResponse from "./utils/ApiResponse.js";
import logger from "#config/logger.js";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.get("/", (req, res) => {
  logger.info("Hello from the api");
  res
    .status(200)
    .json(new ApiResponse(200, null, "This is backend for Acquisitions"));
});

export default app;
