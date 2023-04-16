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
    CANNOT_FIND_PRESENTATION: 4002,
    PRESENTING_PRESENTATION: 4003,
    CANNOT_FIND_SLIDE: 4004,
    INVALID_VOTING_CODE: 4005,
    DELETE_ONLY_SLIDE: 4006,
    CANNOT_EDIT_VOTED_SLIDE: 4007,
    NOT_MATCH_SLIDE_LIST: 4008,

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
    SAVED_SUCCESS: "Lưu thay đổi thành công",
    DELETE_PRESENTATION_SUCCESS: "Xóa bài trình bày thành công",
    RESET_RESULT_SUCCESS: "Làm mới kết quả thành công",
};

export const ERROR_NOTIFICATION = {
    SYSTEM_ERROR: "Có lỗi xảy ra với hệ thống, vui lòng liên hệ admin",
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
    FETCH_PRESENTATION_DETAIL: "Có lỗi xảy ra khi gửi yêu cầu lấy chi tiết bài trình bày",
    CANNOT_FIND_PRESENTATION: "Không tìm thấy bài trình bày đã yêu cầu",
    PRESENTING_PRESENTATION: "Không thể thao tác khi bài trình bày này đang được chiếu",
    CREATE_NEW_SLIDE: "Có lỗi xảy ra khi tạo trang chiếu mới",
    CANNOT_FIND_SLIDE: "Không tìm thấy trang chiếu đã yêu cầu",
    FETCH_SLIDE_DETAIL: "Có lỗi xảy ra khi gửi yêu cầu lấy chi tiết trang chiếu",
    FETCH_VOTING_CODE_PROCESS: "Có lỗi xảy ra khi gửi yêu cầu lấy mã bầu chọn",
    INVALID_VOTING_CODE: "Mã bầu chọn không hợp lệ",
    CANNOT_EDIT_VOTED_SLIDE: "Không thể chỉnh sửa trang chiếu đã có kết quả",
    SAVE_SLIDE_DETAIL_PROCESS: "Có lỗi xảy ra khi lưu thay đổi",
    DELETE_PRESENTATION_PROCESS: "Có lỗi xảy ra khi gửi yêu cầu xóa bài trình bày",
    DELETE_ONLY_SLIDE: "Không thể xóa trang chiếu cuối cùng của bài trình bày",
    SAVE_SLIDE_LIST_PROCESS: "Có lỗi xảy ra khi lưu thay đổi vị trí trang chiếu",
    RESET_RESULT_PROCESS: "Có lỗi xảy ra khi gửi yêu cầu làm mới kết quả",
};

export const PRESENTATION_OWNER_TYPE = {
    OWNER: "owner",
    COLLABORATOR: "collaborator",
};

export const PRESENTATION_DATE_TYPE = {
    ASC: "ASC",
    DESC: "DESC",
};
