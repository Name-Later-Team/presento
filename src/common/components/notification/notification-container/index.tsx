import ReactDOM from "react-dom";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const reactToastifyConfigs: ToastContainerProps = {
    position: "top-center",
    closeOnClick: false,
    limit: 5,
    hideProgressBar: true,
    theme: "colored",
    draggable: false,
};

export default function NotificationContainer() {
    return ReactDOM.createPortal(
        <ToastContainer {...reactToastifyConfigs} />,
        document.querySelector("body") as HTMLElement
    );
}
