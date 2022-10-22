import express from "express";
import { handlerAsync } from "../utils/handlerAsync.js";
import { validateScore, isLoggedIn } from "../utils/utitlityMiddleware.js";
import scoreController from "../controllers/scoreController.js";
import { createScore } from "../controllers/scoreController.js";

export const scoreRouter = express.Router({ mergeParams: true});

// Score Post Route
scoreRouter.post("/", isLoggedIn, validateScore, handlerAsync(createScore))

