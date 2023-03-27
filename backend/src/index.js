import compression from "compression";
import RedisStore from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "process";
import { fileURLToPath } from "url";
import { errorHandler } from "./common/middlewares/error.handler.js";
import { AccessLogStream, Logger } from "./common/utils/logger.js";
import { APP_CONFIG } from "./configs/index.js";
import RedisClient from "./connections/redis.js";
import { router as authRouter } from "./routes/auth.js";
import { router as apiRouter } from "./routes/index.js";

env.TZ = "Asia/Ho_Chi_Minh";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const app = express();

app.enable("trust proxy");

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(APP_CONFIG.cookie.secret));
app.use(
    cors({
        origin: APP_CONFIG.origin,
        credentials: APP_CONFIG.credential,
        allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, X-Request-Id, Content-Type, Authorization, Accept",
        methods: "GET, POST, PUT, PATCH, DELETE",
    })
);

app.use(morgan("combined", { stream: new AccessLogStream() }));

RedisClient.initRedisConnectionAsync();

const redisStore = new RedisStore({
    client: RedisClient.getRedisClient(),
    prefix: "presento",
});

app.use(
    session({
        store: redisStore,
        secret: APP_CONFIG.cookie.secret,
        name: APP_CONFIG.cookie.name,
        resave: false,
        saveUninitialized: false,
        cookie: {
            path: APP_CONFIG.cookie.path,
            httpOnly: true,
            secure: APP_CONFIG.cookie.secure, // false with http server
            maxAge: APP_CONFIG.cookie.maxAge,
        },
    })
);

// set custom headers
app.use(function (req, res, next) {
    res.header("X-Powered-By", APP_CONFIG.powerBy);
    next();
});

// disable get favicon with 404 error
app.get("/favicon.ico", (req, res) => res.status(204).end());

// handle API route here
app.use("/api/auth", authRouter);
app.use("/api", apiRouter);

// serve react app in production mode here
if (APP_CONFIG.appEnvironment !== "development") {
    const CLIENT_BUILD_PATH = path.resolve(__dirname, "../client-build");

    app.use(express.static(CLIENT_BUILD_PATH));

    app.get("*", function (req, res) {
        res.sendFile(path.resolve(CLIENT_BUILD_PATH, "index.html"));
    });
}

// 404
app.use(function (req, res, next) {
    res.sendStatus(404);
});

// error
app.use(errorHandler);

const PORT = APP_CONFIG.appPort;

app.listen(PORT, () => {
    Logger.info(`Server is listening on port:${PORT}`);
});
