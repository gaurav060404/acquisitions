import { signup, signin, signout } from "#controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.route("/sign-up").post(signup);

router.route("/sign-in").post(signin);

router.route("/sign-out").post(signout);

export default router;
