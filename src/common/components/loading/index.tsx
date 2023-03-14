import { Stack } from "react-bootstrap";
import "./styles.scss";

export interface ILoadingProps {
    message?: string;
    color?: string;
    // animationType?: "grow" | "border";
}

export function Loading(props: ILoadingProps) {
    const {
        message,
        color,
        // animationType
    } = props;
    return (
        <Stack direction="vertical" className="loading-container justify-content-center align-items-center">
            <div className="mb-3">
                {/* <Spinner animation={animationType || "grow"} variant={color || "primary"} /> */}
                <div className="loading-container__app-logo-container">
                    <img
                        className="loading-container__app-logo-container__app-logo"
                        src="/images/logo-presento-transparent.png"
                        alt="app-logo"
                        loading="lazy"
                    />
                </div>
            </div>
            {message && <p className={`text-${color || "muted"} text-center`}>{message}</p>}
        </Stack>
    );
}
