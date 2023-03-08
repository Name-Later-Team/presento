import { Route, Navigate } from "react-router-dom";
import Home from "./pages";

export const homeRoutes = (
    <>
        <Route index element={<Home />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
    </>
);
