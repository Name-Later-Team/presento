import { BaseException } from "../exceptions/base.exception.js";
import { Logger } from "../utils/logger.js";

/**
 *
 * @param {any} error
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export function errorHandler(error, req, res, next) {
    if (error instanceof BaseException) {
        const responseData = error.toResponse();
        error.errorDetail && Logger.error(error.errorDetail);
        return res.status(error.status).json(responseData);
    }

    // runtime error
    Logger.error(error.message ?? error);

    res.status(500).json({
        code: 500,
        message: "Đã có lỗi xảy ra, vui lòng liên hệ Admin nhận hỗ trợ",
    });
}
