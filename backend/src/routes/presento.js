import axios from "axios";
import * as express from "express";
import { asyncRouteHandler } from "../common/middlewares/async-route.handler.js";
import { APP_CONFIG } from "../configs/index.js";
import moment from "moment";

export const router = express.Router();

router.get(
    "/v1/presentations/:presentationIdentifier/slides/:slideId",
    asyncRouteHandler(async (req, res) => {
        const { accessToken, tokenType } = req.session?.user ?? {};
        const { presentationIdentifier, slideId } = req.params;

        const slideDetailUri = `/presentation/v1/presentations/${presentationIdentifier}/slides/${slideId}`;
        const slideResultUri = `/presentation/v1/presentations/${presentationIdentifier}/slides/${slideId}/results`;
        const slideDetailHeaders = {
            Authorization: `${tokenType} ${accessToken}`,
            "Client-Id": APP_CONFIG.clientId,
            "Request-Time": moment().format("YYYY-MM-DDTHH:mm:ss+0000"),
            "Resource-Uri": slideDetailUri,
            "Service-Slug": APP_CONFIG.slug,
        };
        const slideResultHeaders = {
            Authorization: `${tokenType} ${accessToken}`,
            "Client-Id": APP_CONFIG.clientId,
            "Request-Time": moment().format("YYYY-MM-DDTHH:mm:ss+0000"),
            "Resource-Uri": slideResultUri,
            "Service-Slug": APP_CONFIG.slug,
        };

        try {
            const slideDetailPromise = axios({
                method: "GET",
                url: `${APP_CONFIG.apiGateway}${slideDetailUri}`,
                headers: slideDetailHeaders,
            });

            const slideResultPromise = axios({
                method: "GET",
                url: `${APP_CONFIG.apiGateway}${slideResultUri}`,
                headers: slideResultHeaders,
            });
            const [slideDetailRes, slideResultRes] = await Promise.all([slideDetailPromise, slideResultPromise]);

            const detailData = slideDetailRes.data?.data;
            const resultData = slideResultRes.data?.data;

            // map data from 2 APIs
            const mappedData = { ...detailData };
            mappedData.respondents = resultData?.respondents ?? 0;
            const choices = detailData?.choices;
            const options = [];
            const results = [];
            if (Array.isArray(choices)) {
                const flag = Array.isArray(resultData?.results);
                choices.sort((a, b) => a?.position - b?.position);
                let haveCorrectAnswer = false;
                choices.forEach((item, idx) => {
                    options.push({
                        key: item?.id ?? idx,
                        value: item?.label ?? "",
                        type: item?.type ?? "",
                        position: item?.position ?? -1,
                        metadata: item?.metadata,
                    });
                    const tempResult = {
                        key: item?.id ?? idx,
                        value: 0,
                    };
                    if (flag) {
                        tempResult.value =
                            resultData?.results?.find((element) => element?.id === item?.id)?.score[0] ?? 0;
                    }
                    results.push(tempResult);
                    if (item?.correctAnswer === true) {
                        haveCorrectAnswer = true;
                        mappedData.selectedOption = item?.id;
                    }
                });
                if (!haveCorrectAnswer) mappedData.selectedOption = "";
                mappedData.options = options;
                mappedData.result = results;
            }

            delete mappedData.choices;

            return res.status(200).send({
                code: 200,
                message: "OK",
                data: mappedData,
            });
        } catch (error) {
            if (error.response) {
                return res.status(error.response.status).send(error.response.data);
            }

            Logger.error(error);

            // todo: handle error here

            return res.status(504).json({
                code: 504,
                message: "Gateway Timeout",
            });
        }
    })
);
