import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { postAuthenticationTicketAsync } from "../controllers/socket.controller.js";

export const router = express.Router();

router.post("/v1/tickets", asyncRouteHandler(postAuthenticationTicketAsync));
