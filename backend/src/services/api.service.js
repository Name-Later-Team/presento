import axios from "axios";
import moment from "moment";
import { Logger } from "../common/utils/logger.js";
import { APP_CONFIG } from "../configs/index.js";

/**
 * @description This service is a proxy agent that helps app to connect to API Gateway API
 * - Current solution supports access token request only
 * - TODO: add rsa request utils if needed
 */
export class ApiService {
    #axiosInstance;

    constructor() {
        this.#axiosInstance = axios.create({
            baseURL: APP_CONFIG.apiGateway,
        });

        this.#axiosInstance.interceptors.response.use(
            function (response) {
                return response;
            },
            function (error) {
                const { response } = error;

                if (!response) {
                    Logger.error(error.message);
                    return Promise.reject({ status: 504, data: { code: 504, message: "Gateway Timeout" } });
                }

                // if request is unauthorized and this error is caused by developer - missing fields in header when calling gateway
                const { status, data } = response;
                if (status === 401 && data.code !== 4011) {
                    Logger.error(JSON.stringify(response.data));
                    return Promise.reject({ status: 500, data: { code: 500, message: "Internal Server Error" } });
                }

                return Promise.reject({ status: response.status, data: response.data });
            }
        );
    }

    /**
     * @param {string} path path to resource, can contain query string
     * @param {any} headers additional header fields
     */
    async getRequestAsync(path, headers = {}) {
        const baseHeaders = this.#generateBaseHeaders(path);

        const result = await this.#axiosInstance.get(path, {
            headers: {
                ...headers,
                ...baseHeaders,
                "User-Agent": APP_CONFIG.slug,
            },
        });
        return result;
    }

    /**
     * @param {string} path path to resource
     * @param {any} body body as json format
     * @param {any} headers additional header fields
     */
    async postJsonRequestAsync(path, body, headers = {}) {
        const baseHeaders = this.#generateBaseHeaders(path);

        const result = await this.#axiosInstance.post(path, body, {
            headers: {
                ...headers,
                ...baseHeaders,
                "Content-Type": "application/json+text",
                "User-Agent": APP_CONFIG.slug,
            },
        });
        return result;
    }

    /**
     * @param {string} path path to resource
     * @param {any} body body as json format
     * @param {any} headers additional header fields
     */
    async putJsonRequestAsync(path, body, headers = {}) {
        const baseHeaders = this.#generateBaseHeaders(path);

        const result = await this.#axiosInstance.put(path, body, {
            headers: {
                ...headers,
                ...baseHeaders,
                "Content-Type": "application/json+text",
                "User-Agent": APP_CONFIG.slug,
            },
        });
        return result;
    }

    /**
     * @param {string} path path to resource
     * @param {any} headers additional header fields
     */
    async deleteRequestAsync(path, headers = {}) {
        const baseHeaders = this.#generateBaseHeaders(path);

        const result = await this.#axiosInstance.delete(path, {
            headers: {
                ...headers,
                ...baseHeaders,
                "User-Agent": APP_CONFIG.slug,
            },
        });
        return result;
    }

    #generateBaseHeaders(path) {
        return {
            "Client-Id": APP_CONFIG.clientId,
            "Request-Time": moment().format("YYYY-MM-DDTHH:mm:ssZ"),
            "Resource-Uri": path.replace(/(\?.+)|\?/, ""),
            "Service-Slug": APP_CONFIG.slug,
        };
    }
}
