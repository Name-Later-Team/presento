import statuses from "statuses";

export class BaseException extends Error {
    constructor(message, status, code, responseData, errorDetail) {
        // Calling parent constructor of base Error class.
        super(message, status);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;
        this.responseData = responseData;
        this.errorDetail = errorDetail;
        this.code = code;

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);

        this.status = statuses.message[status] ? status : 500;
        this.message = message ?? statuses.message[status];
    }

    toResponse() {
        return {
            code: this.code,
            message: this.message,
            data: this.responseData,
        };
    }
}
