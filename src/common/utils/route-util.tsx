import { Navigate, Route } from "react-router-dom";

export const createRouteTemplate = (routes: JSX.Element) => {
    return (
        <>
            {routes}
            <Route path="*" element={<Navigate to="/404" replace />} />
        </>
    );
};
