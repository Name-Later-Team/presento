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
    LOGIN_EXPIRED: 4011,
    LOGIN_FAILED: 4012,

    // 403: FORBIDDEN
    INVALID_RESOURCE_PERMISSION: 4038,
};

export const SUCCESS_NOTIFICATION = {
    ADD_SLIDE_SUCCESS: "Thêm trang chiếu mới thành công",
    DELETE_SLIDE_SUCCESS: "Xóa trang chiếu thành công",
};

export const ERROR_NOTIFICATION = {
    LOGIN_PROCESS: "Có lỗi xảy ra trong quá trình đăng nhập",
    SINGUP_PROCESS: "Có lỗi xảy ra trong quá trình đăng ký",
    MISSING_AUTHORIZATION_CODE: "Thông tin để xử lý đăng nhập bị thiếu",
    CHECK_LOGIN_PROCESS: "Có lỗi xảy ra trong quá trình kiểm tra",
    FETCH_USER_INFO_PROCESS: "Có lỗi xảy ra khi lấy thông tin người dùng",
};

export const PRESENTATION_TYPE = {
    OWNER: "owner",
    COLLABORATOR: "collaborator",
};
