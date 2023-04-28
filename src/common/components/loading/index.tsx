import { Stack } from "react-bootstrap";
import "./styles.scss";

export interface ILoadingProps {
    message?: string;
    color?: string;
}

export function Loading(props: ILoadingProps) {
    const { message, color } = props;
    return (
        <Stack direction="vertical" className="loading-container justify-content-center align-items-center">
            <div className="loading-container__app-logo-container mb-3">
                <img
                    className="loading-container__app-logo-container__app-logo"
                    src="/images/logo-presento-transparent.png"
                    alt="app-logo"
                    loading="lazy"
                />
            </div>
            {message && <p className={`text-${color || "muted"} text-center`}>{message}</p>}
        </Stack>
    );
}
