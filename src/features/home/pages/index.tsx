import { useEffect } from "react";
import { Spinner, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./style.scss";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        let redirectTo = "/dashboard/demo";
        setTimeout(() => navigate(redirectTo), 900);
    }, [navigate]);

    return (
        <div className="home">
            <Stack className="home__card py-5 px-4 my-auto text-center" gap={4}>
                <div className="home__card__app-logo-container">
                    <img
                        className="home__card__app-logo-container__app-logo"
                        src="/images/logo-presento-transparent.png"
                        alt="app-logo"
                        loading="lazy"
                    />
                </div>

                <div>
                    <Spinner animation="grow" variant="primary" />
                </div>
            </Stack>
        </div>
    );
}
