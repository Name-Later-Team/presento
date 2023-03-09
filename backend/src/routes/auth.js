import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { getLoginUri, getUserInfomationAsync, obtainLoginTokenAsync } from "../controllers/auth.controller.js";

export const router = express.Router();

router.get("/login_url", asyncRouteHandler(getLoginUri));

router.post("/token", asyncRouteHandler(obtainLoginTokenAsync));

router.get("/userinfo", asyncRouteHandler(getUserInfomationAsync));
