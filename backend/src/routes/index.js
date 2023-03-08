import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { ResponseBuilder } from "../common/utils/builders/response.builder.js";

export const router = express.Router();

router.get(
    "/",
    asyncRouteHandler((req, res) => {
        res.json(new ResponseBuilder().withData("Presento Backend For Frontend").build());
    })
);
