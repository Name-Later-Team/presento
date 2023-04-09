import { ApiService } from "../services/api.service.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getPresentationSlideDetailAsync(req, res) {
    const { accessToken, tokenType } = req.session?.user ?? {};
    const authorization = `${tokenType} ${accessToken}`;

    const { path } = req;

    try {
        const apiService = new ApiService();

        const slideDetailPromise = apiService.getRequestAsync(`/presentation${path}`, {
            Authorization: authorization,
        });

        const slideResultPromise = apiService.getRequestAsync(`/presentation${path}/results`, {
            Authorization: authorization,
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
                    tempResult.value = resultData?.results?.find((element) => element?.id === item?.id)?.score[0] ?? 0;
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

        return res.send({
            code: 200,
            message: "OK",
            data: mappedData,
        });
    } catch (error) {
        // pass error to client
        return res.status(error.status).send(error.data);
    }
}
