import { Route } from "react-router-dom";
import Home from "./pages";

export const homeRoutes = (
    <>
        <Route index element={<Home />} />
    </>
);
