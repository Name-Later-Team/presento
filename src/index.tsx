import React from "react";
import ReactDOM from "react-dom/client";
// import './index.css';
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/scss/index.scss";
import Home from "./Home";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route index element={<App />} />
				<Route path="home" element={<Home />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
