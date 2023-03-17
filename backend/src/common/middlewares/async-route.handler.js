/**
 * @description Handle all error while running controller and pass to the error-handler
 */
export const asyncRouteHandler = (callback) => {
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     */
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
