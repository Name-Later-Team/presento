import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { getPresentationSlideDetailAsync } from "../controllers/presentation.controller.js";

export const router = express.Router();

router.get(
    "/v1/presentations/:presentationIdentifier/slides/:slideId",
    asyncRouteHandler(getPresentationSlideDetailAsync)
);
