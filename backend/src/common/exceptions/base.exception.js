import statuses from "statuses";

export class BaseException extends Error {
    constructor(message, status, responseData, errorDetail) {
        // Calling parent constructor of base Error class.
        super(message, status);

        // Saving class name in the property of our custom error as a shortcut.
        this.name = this.constructor.name;
        this.responseData = responseData;
        this.errorDetail = errorDetail;

        // Capturing stack trace, excluding constructor call from it.
        Error.captureStackTrace(this, this.constructor);

        this.status = statuses.message[status] ? status : 500;
        this.message = message ?? statuses.message[status];

        console.log(statuses.message[status]);
    }

    toResponse() {
        return {
            code: this.status,
            message: this.message,
            data: this.responseData,
        };
    }
}
