import { Route } from "react-router-dom";
import PresentationList from "./pages/presentation-list";

export const presentationRoutes = (
    <>
        <Route path="presentation-list" element={<PresentationList />} />
    </>
);
