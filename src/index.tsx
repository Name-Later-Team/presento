import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "react-tooltip/dist/react-tooltip.css";
import "./assets/scss/index.scss";
import NotificationContainer from "./common/components/notification/notification-container";
import reportWebVitals from "./reportWebVitals";
import { GlobalContextProvider } from "./common/contexts/global-context";
import { AuthContextProvider } from "./common/contexts/auth-context";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.Fragment>
        <BrowserRouter>
            <GlobalContextProvider>
                <AuthContextProvider>
                    <>
                        <App />
                        <NotificationContainer />
                    </>
                </AuthContextProvider>
            </GlobalContextProvider>
        </BrowserRouter>
    </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
