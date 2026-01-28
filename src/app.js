import express from "express";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, null, "This is backend for Acquisitions"));
});

export default app;
