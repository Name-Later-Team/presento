export const COMMON_CONSTANTS = {
    API_MESSAGE: {
        INTERNAL_ERROR: "Đã có lỗi trong quá trình xử lý, vui lòng liên hệ admin",
    },
    pagination: {
        limit: 10,
        defaultPage: 1,
        defaultTotal: 0,
    },
};

export const RESPONSE_CODE = {
    // 400: BAD REQUEST

    // 401: UNAUTHORIZED
    INVALID_TOKEN: 4011,
    MISSING_TOKEN: 4012,

    // 403: FORBIDDEN
    INVALID_RESOURCE_PERMISSION: 4038,
};

export const PRESENTATION_TYPE = {
    OWNER: "owner",
    COLLABORATOR: "collaborator",
};
