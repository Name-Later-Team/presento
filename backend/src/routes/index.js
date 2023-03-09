import axios from "axios";
import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { ResponseBuilder } from "../common/utils/builders/response.builder.js";
import { APP_CONFIG } from "../configs/index.js";

export const router = express.Router();

router.get(
    "/:service/:path",
    asyncRouteHandler((req, res) => {
        axios({
            method: req.method,
            url: `${APP_CONFIG.apiGateway}/${req.params.service}/${req.params.path}`,
        })
            .then((response) => res.send(response.data))
            .catch((error) => {
                logger.error("Forward error - " + error);
                if (axios.isAxiosError(error)) {
                    return res.status(error.response.status).send(error.response.data);
                }

                return res.status(504).json({
                    code: 504,
                    message: statuses(504),
                    data: {},
                    metadata: { createdDate: new Date().toISOString() },
                });
            });
    })
);

router.get(
    "/",
    asyncRouteHandler((req, res) => {
        res.json(new ResponseBuilder().withData("Presento Backend For Frontend").build());
    })
);
