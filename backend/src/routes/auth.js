import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import {
    checkUserLoginState,
    getLoginUri,
    getUserInfomationAsync,
    logout,
    obtainLoginTokenAsync,getSignupUri
} from "../controllers/auth.controller.js";

export const router = express.Router();

router.get("/login_url", asyncRouteHandler(getLoginUri));

router.post("/token", asyncRouteHandler(obtainLoginTokenAsync));

router.get("/userinfo", asyncRouteHandler(getUserInfomationAsync));

router.get("/state", asyncRouteHandler(checkUserLoginState));

router.get("/signup", asyncRouteHandler(getSignupUri));

router.get("/logout", asyncRouteHandler(logout));

