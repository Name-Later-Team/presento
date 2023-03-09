import * as dotenv from "dotenv";
dotenv.config();

export const APP_CONFIG = {
    appEnvironment: process.env.APP_ENV || "development",
    appProtocol: process.env.PROTOCOL || "http",
    appHost: process.env.HOST || "localhost",
    appPort: process.env.PORT ? +process.env.PORT : 3001,
    logLevel: process.env.LOG_LEVEL || "debug",
    logDriver: process.env.LOG_DRIVER || "console",
    powerBy: process.env.POWER_BY || "",

    origin: process.env.ORIGIN || "*",
    credential: Boolean(process.env.CREDENTIAL).valueOf(),

    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
    },

    cookie: {
        name: process.env.COOKIE_NAME,
        secret: process.env.COOKIE_SECRET,
        path: process.env.COOKIE_PATH,
        secure: Boolean(process.env.COOKIE_SECURE).valueOf(),
        maxAge: +process.env.COOKIE_MAX_AGE,
    },

    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,

    authz: {
        baseUrl: process.env.AUTHZ_URL,
        redirectUri: process.env.AUTHZ_REDIRECT_URI,
        scope: process.env.AUTHZ_SCOPE,
        endpoints: {
            login: process.env.AUTHZ_ENDPOINT_LOGIN,
            token: process.env.AUTHZ_ENDPOINT_TOKEN,
            userinfo: process.env.AUTHZ_ENDPOINT_USERINFO,
        },
    },
};
