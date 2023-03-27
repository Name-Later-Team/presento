import { Navigate, Route } from "react-router-dom";
import EditPresentationLayout from "../../common/layouts/edit-presentation";
import SidebarSlides from "../../common/layouts/edit-presentation/sidebar-slides";
import PresentationFetching from "./components/presentation-fetching";
import EditPresentation from "./pages/presentation-edit";
import PresentPresentation from "./pages/presentation-present";

export const presentationDetailRoutes = (
    <>
        <Route path="" element={<Navigate to="/404" />} />

        {/* fetching data first time for editing slide */}
        <Route path=":presentationId" element={<PresentationFetching />} />

        {/* edit slide in a presentation */}
        <Route
            path=":presentationId/:slideId/edit"
            element={<EditPresentationLayout sidebarElement={<SidebarSlides />} />}
        >
            <Route index element={<EditPresentation />} />
        </Route>

        {/* present page */}
        <Route path=":presentationId/:slideId" element={<PresentPresentation />} />
    </>
);
