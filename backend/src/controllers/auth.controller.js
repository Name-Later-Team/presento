import axios, { isAxiosError } from "axios";
import crypto from "crypto";
import moment from "moment";
import queryString from "query-string";
import { v4 } from "uuid";
import { ErrorBuilder } from "../common/utils/builders/error.builder.js";
import { ResponseBuilder } from "../common/utils/builders/response.builder.js";
import { APP_CONFIG } from "../configs/index.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getLoginUri(req, res) {
    const codeVerifier = crypto.randomBytes(32).toString("base64url");
    const codeChallenge = crypto.createHash("sha256").update(codeVerifier).digest().toString("base64url");

    const queryParams = {
        client_id: APP_CONFIG.clientId,
        redirect_uri: APP_CONFIG.authz.redirectUri,
        response_type: "code",
        scope: APP_CONFIG.authz.scope,
        state: v4(),
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
    };

    const loginUrl = `${APP_CONFIG.authz.baseUrl}${APP_CONFIG.authz.endpoints.login}?${queryString.stringify(
        queryParams
    )}`;

    // store code verifier for the next request
    req.session.codeVerifier = codeVerifier;
    req.session.save();

    res.json(new ResponseBuilder().withData({ loginUrl }).build());
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function obtainLoginTokenAsync(req, res) {
    const { body, session } = req;

    const { codeVerifier } = session;
    const { code } = body;

    const payload = {
        grant_type: "authorization_code",
        client_id: APP_CONFIG.clientId,
        client_secret: APP_CONFIG.clientSecret,
        code,
        code_verifier: codeVerifier,
    };

    // remove old code verifier
    delete req.session.codeVerifier;

    try {
        const response = await axios.post(`${APP_CONFIG.authz.baseUrl}${APP_CONFIG.authz.endpoints.token}`, payload);

        const { data } = response;
        // store token information into session
        req.session.user = {
            accessToken: data.access_token,
            // refreshToken: data.refresh_token, // temporary disable refresh token feature
            expiresAt: moment().add(data.expires_in, "seconds").toISOString(),
            tokenType: data.token_type,
        };

        req.session.save();

        // login success
        res.json(new ResponseBuilder().build());
    } catch (error) {
        if (!isAxiosError(error)) {
            throw error;
        }

        const response = error.response ?? {};
        throw new ErrorBuilder()
            .withStatus(401)
            .withCode(4011)
            .withMessage("Đăng nhập thất bại")
            .withErrors(response.data)
            .build();
    }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUserInfomationAsync(req, res) {
    // get access token in session
    const { user } = req.session ?? {};

    const { accessToken, tokenType } = user ?? {};

    try {
        const response = await axios.get(`${APP_CONFIG.authz.baseUrl}${APP_CONFIG.authz.endpoints.userinfo}`, {
            headers: {
                Authorization: `${tokenType} ${accessToken}`,
            },
        });

        const { data } = response;
        if (data.status && data.status === "error") {
            throw new ErrorBuilder()
                .withStatus(401)
                .withCode(4011)
                .withMessage("Phiên đăng nhập hết hạn")
                .withErrors(data)
                .build();
        }

        res.json(
            new ResponseBuilder()
                .withData({
                    userId: data.sub,
                    username: data.name,
                    email: data.email,
                    avatar: data.picture,
                    fullname: data.preferred_username,
                })
                .build()
        );
    } catch (error) {
        if (!isAxiosError(error)) {
            throw error;
        }

        const response = error.response ?? {};
        throw new ErrorBuilder()
            .withStatus(401)
            .withCode(4011)
            .withMessage("Phiên đăng nhập hết hạn")
            .withErrors(response.data)
            .build();
    }
}
