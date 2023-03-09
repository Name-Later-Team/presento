import { useEffect } from "react";
import { Spinner, Stack } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import "./style.scss";

export default function Callback() {
    const [queries] = useSearchParams();

    useEffect(() => {
        console.log(queries.toString());
    }, [queries]);

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

            <div className="d-flex align-items-center justify-content-center">
                <Spinner animation="grow" variant="primary" />
            </div>

            <p className="text-primary text-center fw-bold">Hệ thống đăng xử lý, vui lòng chờ</p>
        </Stack>
    );
}
