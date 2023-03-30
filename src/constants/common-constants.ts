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
    VALIDATION_ERROR: 4001,

    // 401: UNAUTHORIZED
    LOGIN_EXPIRED: 4011,
    LOGIN_FAILED: 4012,

    // 403: FORBIDDEN
    INVALID_RESOURCE_PERMISSION: 4038,
};

export const SUCCESS_NOTIFICATION = {
    ADD_SLIDE_SUCCESS: "Thêm trang chiếu mới thành công",
    DELETE_SLIDE_SUCCESS: "Xóa trang chiếu thành công",
    CREATE_PRESENTATION: "Tạo bài trình bày mới thành công",
    COPIED_LINK_SUCCESS: "Sao chép liên kết thành công",
    RENAME_PRESENTATION_SUCCESS: "Đổi tên bài trình bày thành công",
};

export const ERROR_NOTIFICATION = {
    LOGIN_PROCESS: "Có lỗi xảy ra trong quá trình đăng nhập",
    SINGUP_PROCESS: "Có lỗi xảy ra trong quá trình đăng ký",
    MISSING_AUTHORIZATION_CODE: "Thông tin để xử lý đăng nhập bị thiếu",
    CHECK_LOGIN_PROCESS: "Có lỗi xảy ra trong quá trình kiểm tra",
    LOGIN_EXPIRED: "Phiên đăng nhập đã hết hạn",
    FETCH_USER_INFO_PROCESS: "Có lỗi xảy ra khi lấy thông tin người dùng",
    PRESENT_FAILED: "Có lỗi xảy ra khi cập nhật trạng thái trình chiếu, vui lòng thử lại sau",
    FETCH_SLIDE_RESULT: "Có lỗi xảy ra khi lấy kết quả",
    UPDATE_PRESENTATION_STATE: "Có lỗi xảy ra khi cập nhật trạng thái trình chiếu, vui lòng thử lại sau",
    FETCH_PRESENTATION_LIST: "Có lỗi xảy ra khi lấy danh sách các bài trình bày",
    VALIDATION_ERROR: "Có lỗi trong yêu cầu đã gửi",
    CREATE_PRESENTATION: "Có lỗi xảy ra khi gửi yêu cầu tạo bài trình bày mới",
    RENAME_PRESENTATION_FAILED: "Có lỗi xảy ra khi gửi yêu cầu đổi tên bài trình bày",
};

export const PRESENTATION_TYPE = {
    OWNER: "owner",
    COLLABORATOR: "collaborator",
};
