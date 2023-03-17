import statuses from "statuses";

/**
 * @description create a builder that construct the general data response structure based on API standard
 */
export class ResponseBuilder {
    _code;
    _message;
    _data;

    constructor() {
        this._code = 200;
        this._message = statuses.message[this._code] ?? "OK";
        this._data = undefined;
    }

    withMessage(msg) {
        this._message = msg && msg.trim() ? msg : statuses.message[this._code];
        return this;
    }

    withCode(code) {
        this._code = !code || !statuses(code) ? 200 : code;
        this._message = statuses.message[this._code] ?? "OK";
        return this;
    }

    withData(data) {
        this._data = data;
        return this;
    }

    /**
     * @example
     *  {
            "code": "200",
            "message": "OK",
            "data": "any",
        }
     */
    build() {
        return {
            code: this._code,
            message: this._message,
            data: this._data,
        };
    }
}
