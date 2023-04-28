import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { ResponseBuilder } from "../common/utils/builders/response.builder.js";
import { ApiService } from "../services/api.service.js";

export const router = express.Router();

router.get(
    "/:service/v1/*",
    asyncRouteHandler(async (req, res) => {
        const { accessToken, tokenType } = req.session?.user ?? {};
        const authorization = `${tokenType} ${accessToken}`;

        new ApiService()
            .getRequestAsync(req.originalUrl.replace("/api", ""), { Authorization: authorization })
            .then((response) => res.status(response.status).send(response.data))
            .catch((error) => {
                res.status(error.status).send(error.data);
            });
    })
);

router.post(
    "/:service/v1/*",
    asyncRouteHandler((req, res) => {
        const { accessToken, tokenType } = req.session?.user ?? {};
        const authorization = `${tokenType} ${accessToken}`;

        new ApiService()
            .postJsonRequestAsync(req.originalUrl.replace("/api", ""), req.body, { Authorization: authorization })
            .then((response) => res.status(response.status).send(response.data))
            .catch((error) => {
                res.status(error.status).send(error.data);
            });
    })
);

router.put(
    "/:service/v1/*",
    asyncRouteHandler((req, res) => {
        const { accessToken, tokenType } = req.session?.user ?? {};
        const authorization = `${tokenType} ${accessToken}`;

        new ApiService()
            .putJsonRequestAsync(req.originalUrl.replace("/api", ""), req.body, { Authorization: authorization })
            .then((response) => res.status(response.status).send(response.data))
            .catch((error) => {
                res.status(error.status).send(error.data);
            });
    })
);

router.delete(
    "/:service/v1/*",
    asyncRouteHandler((req, res) => {
        const { accessToken, tokenType } = req.session?.user ?? {};
        const authorization = `${tokenType} ${accessToken}`;

        new ApiService()
            .deleteRequestAsync(req.originalUrl.replace("/api", ""), { Authorization: authorization })
            .then((response) => res.status(response.status).send(response.data))
            .catch((error) => {
                res.status(error.status).send(error.data);
            });
    })
);

router.get(
    "/",
    asyncRouteHandler((req, res) => {
        res.json(new ResponseBuilder().withData("Presento Backend For Frontend").build());
    })
);
