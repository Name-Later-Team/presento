import { useEffect, useState } from "react";
import { Spinner, Stack } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Notification } from "../../../../common/components/notification";
import { useAuth } from "../../../../common/contexts/auth-context";
import { RESPONSE_CODE } from "../../../../constants";
import AuthService from "../../../../services/auth-service";
import "./style.scss";

export default function Callback() {
    const [queries] = useSearchParams();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(true);
    const { fetchLatestUserInfoFromApi } = useAuth();

    useEffect(() => {
        const callLogin = async () => {
            const code = queries.get("code");

            if (code === "" || code == null) {
                Notification.notifyError("Thông tin xử lý đăng nhập bị thiếu");
                return;
            }
            try {
                const res = await AuthService.postAuthorizationCode(code);

                if (res.code === 200) {
                    setLoggedIn(true);
                    fetchLatestUserInfoFromApi();
                    setTimeout(() => navigate("/"), 1500);
                    return;
                }

                if (res.code === RESPONSE_CODE.INVALID_TOKEN) {
                    throw new Error("Login error");
                }

                throw new Error("Unhandled error code");
            } catch (err) {
                console.error("Callback:", err);
                Notification.notifyError("Có lỗi xảy ra trong quá trình đăng nhập");
            }
        };

        callLogin();
        // eslint-disable-next-line
    }, [queries, navigate]);

    return (
        <Stack className="p-4" gap={3}>
            <div className="app-logo-container">
                <img
                    className="app-logo-container__app-logo"
                    src="/images/logo-presento-transparent.png"
                    alt="app-logo"
                    loading="lazy"
                />
            </div>

            <p className="text-muted">Hệ thống tạo bài trình bày và lấy ý kiến thời gian thực</p>

            {!loggedIn ? (
                <>
                    <div className="d-flex align-items-center justify-content-center">
                        <Spinner animation="grow" variant="primary" />
                    </div>

                    <p className="text-primary text-center fw-bold">Hệ thống đăng xử lý, vui lòng chờ</p>
                </>
            ) : (
                <>
                    <p className="text-success text-center fw-bold">Đăng nhập thành công, đang chuyển hướng ...</p>
                </>
            )}
        </Stack>
    );
}
