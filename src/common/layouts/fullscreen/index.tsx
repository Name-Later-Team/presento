import { Outlet } from "react-router-dom";
import { IBaseComponent } from "../../interfaces";
import "./style.scss";

interface IFullscreenLayout extends IBaseComponent {
    backgroundStyle?: Object;
    noPadding?: boolean;
}

export default function FullscreenLayout(props: IFullscreenLayout) {
    const { backgroundStyle, noPadding } = props;
    const container = noPadding !== undefined && noPadding === true ? "w-100" : "container-xxl";
    return (
        <div className="fullscreen-layout" style={backgroundStyle}>
            <div className={`fullscreen-layout__container ${container}`}>
                <Outlet />
            </div>
        </div>
    );
}
