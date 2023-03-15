import { useCallback, useEffect, useState } from "react";
import { Button, Spinner, Stack } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Notification } from "../../../../common/components/notification";
import { ERROR_NOTIFICATION } from "../../../../constants";
import AuthService from "../../../../services/auth-service";
import "./style.scss";

export default function Redirect() {
    const [queries] = useSearchParams();
    const [isSubmitting] = useState(false);

    const handleLogin = useCallback(async () => {
        try {
            const res = await AuthService.getLoginUrl();

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
            Notification.notifyError(ERROR_NOTIFICATION.LOGIN_PROCESS);
        }
    }, []);

    // redirect automatically to the login page of IAM
    useEffect(() => {
        const autoRedirectLogin = queries.get("auto_redirect_login");

        if (autoRedirectLogin == null || autoRedirectLogin === "") {
            return;
        }

        if (autoRedirectLogin === "true") {
            handleLogin();
        }
    }, [queries, handleLogin]);

    const handleRegister = async () => {
        try {
            const res = await AuthService.getSignupUrl();

            if (res.code === 200) {
                const signupUri = res.data?.signupUri;
                if (signupUri === "" || signupUri == null) {
                    throw new Error("Unknown signup uri");
                }

                window.location.href = signupUri;
            }

            throw new Error("Unhandled error code");
        } catch (err) {
            console.error("Redirect:", err);
            Notification.notifyError(ERROR_NOTIFICATION.SINGUP_PROCESS);
        }
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
