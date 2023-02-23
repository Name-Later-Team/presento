import { Logger } from "../utils/logger.js";

// TODO: this middleware must be modified
export function errorHandler(error, req, res, next) {
    Logger.error(error);

    res.sendStatus(500);
}