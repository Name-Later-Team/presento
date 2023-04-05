import { Button, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style.scss";

export default function Forbidden() {
    const navigate = useNavigate();
    return (
        <div className="forbidden__forbidden-content">
            <Stack className="forbidden-content__stack" gap={3}>
                <h2>Truy cập bị cấm</h2>
                <p className="mx-3">Bạn không được phép truy cập trang này.</p>
                <Button className="mb-3" variant="primary" onClick={() => navigate("/", { replace: true })}>
                    Về trang chủ
                </Button>
                <div>
                    <img
                        src="svgs/undraw_warning.svg"
                        style={{ width: "500px" }}
                        alt="forbidden-illustration"
                        className="img-fluid"
                    ></img>
                </div>
            </Stack>
        </div>
    );
}
