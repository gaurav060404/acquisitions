import express from "express";

const router = express.Router();

router.get("/sign-up", (req, res) => {
  res.send("/sign-up");
});
router.get("/sign-in", (req, res) => {
  res.send("/sign-in");
});
router.get("/sign-out", (req, res) => {
  res.send("/sign-out");
});

export default router;
