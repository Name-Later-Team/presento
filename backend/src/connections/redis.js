import { createClient } from "redis";
import { Logger } from "../common/utils/logger.js";
import { APP_CONFIG } from "../configs/index.js";

const clients = {};

let tryCount = 5;

function initRedisConnectionAsync() {
    console.log({ url: `redis://${APP_CONFIG.redis.host}:${APP_CONFIG.redis.port}` });
    const redisClient = createClient({ url: `redis://${APP_CONFIG.redis.host}:${APP_CONFIG.redis.port}` });

    redisClient.connect();

    clients.redisClient = redisClient;

    redisClient.on("connect", () => Logger.info("Redis connected"));

    redisClient.on("end", () => Logger.info("Redis disconnected"));

    redisClient.on("reconnecting", () => {
        Logger.info("Redis reconnecting");
        tryCount--;

        if (tryCount === 0) {
            process.exit(1);
        }
    });

    redisClient.on("error", (error) => {
        Logger.info("Redis error", error);
    });
}

function getRedisClient() {
    return clients.redisClient;
}

const RedisClient = {
    initRedisConnectionAsync,
    getRedisClient,
};

export default RedisClient;
