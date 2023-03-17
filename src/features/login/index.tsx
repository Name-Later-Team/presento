import { Route } from "react-router";
import Callback from "./components/callback";
import Redirect from "./components/redirect";
import Login from "./pages";

export const loginRoutes = (
    <>
        <Route path="" element={<Login innerComponent={<Redirect />} />} />
        <Route path="callback" element={<Login innerComponent={<Callback />} />} />
    </>
);
