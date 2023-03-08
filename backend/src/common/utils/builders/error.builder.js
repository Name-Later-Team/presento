import { BaseException } from "../../exceptions/base.exception.js";

/**
 * @description create a builder that construct the general error structure based on AppError
 */
export class ErrorBuilder {
    _message;
    _responseData;
    _errors;

    constructor() {
        this._status = 500;
    }

    withStatus(status) {
        this._status = status;
        return this;
    }

    withMessage(message) {
        this._message = message;
        return this;
    }

    withResponseData(resData) {
        this._responseData = resData;
        return this;
    }

    withErrors(errors) {
        this._errors = errors;
        return this;
    }

    build() {
        return new BaseException(this._message, this._status, this._responseData, this._errors);
    }
}
