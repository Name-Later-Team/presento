import { useState } from "react";
import { Button, Spinner, Stack } from "react-bootstrap";
import { Notification } from "../../../../common/components/notification";
import { HttpService } from "../../../../services";
import "./style.scss";

export default function Redirect() {
    const [isSubmitting] = useState(false);

    const handleLogin = async () => {
        try {
            const res = await HttpService.get<any>("/api/auth/login_url");

            if (res.code === 200) {
                const loginUrl = res.data?.loginUrl;
                if (loginUrl === "" || loginUrl == null) {
                    throw new Error("Unknown login url");
                }

                window.location.href = loginUrl;
            }

            throw new Error("Unhandled error code");
        } catch (err) {
            console.error("Redirect:", err);
            Notification.notifyError("Có lỗi xảy ra trong quá trình đăng nhập");
        }
    };

    const handleRegister = () => {
        console.log("Do something");
    };

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

            <Button disabled={isSubmitting} onClick={handleLogin} variant="primary" className="text-uppercase btn-lg">
                {isSubmitting ? (
                    <div className="d-flex align-items-center justify-content-center">
                        <Spinner animation="grow" variant="light" />
                    </div>
                ) : (
                    "Đăng nhập"
                )}
            </Button>

            <div className="d-flex align-items-center text-uppercase">
                <hr className="flex-grow-1" />
                <span className="mx-2">hoặc</span>
                <hr className="flex-grow-1" />
            </div>

            <Button
                disabled={isSubmitting}
                onClick={handleRegister}
                variant="outline-secondary"
                className="text-uppercase btn-lg"
            >
                {isSubmitting ? (
                    <div className="d-flex align-items-center justify-content-center">
                        <Spinner animation="grow" variant="primary" />
                    </div>
                ) : (
                    "Đăng ký"
                )}
            </Button>
        </Stack>
    );
}
