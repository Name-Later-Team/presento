import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import CustomizedTooltip from "../../../common/components/tooltip";
import { IBaseComponent } from "../../../common/interfaces";

interface ILoginProps extends IBaseComponent {
    innerComponent: JSX.Element;
}

export default function Login(props: ILoginProps) {
    const { innerComponent } = props;
    const navigate = useNavigate();

    return (
        <div className="login">
            <Card className="login__card">
                {innerComponent}
                <Button
                    id="login__to-home-btn"
                    onClick={() => navigate("/")}
                    className="login__back-to-home-btn"
                    variant="light"
                >
                    <FontAwesomeIcon icon={faHouse} size="lg" />
                </Button>
                <CustomizedTooltip anchorSelect="#login__to-home-btn">Về trang chủ</CustomizedTooltip>
            </Card>
        </div>
    );
}
