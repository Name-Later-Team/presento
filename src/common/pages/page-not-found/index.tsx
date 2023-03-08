import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style.scss";

export default function PageNotFound() {
    const navigate = useNavigate();
    return (
        <div className="page-not-found__page-not-found-content">
            <Stack className="page-not-found-content__stack" gap={3}>
                <h2>Không tìm thấy trang</h2>
                <p className="mx-3">Xin lỗi! 😖 Không thể tìm thấy liên kết này.</p>
                <Button className="mb-3" variant="primary" onClick={() => navigate("/", { replace: true })}>
                    Về trang chủ
                </Button>
                <div>
                    <img
                        src="svgs/undraw_page_not_found.svg"
                        style={{ width: "500px" }}
                        alt="page-not-found-illustration"
                        className="img-fluid"
                    ></img>
                </div>
            </Stack>
        </div>
    );
}
