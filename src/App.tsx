import { Navigate, Route, Routes } from "react-router";
import PresentationList from "./features/presentation/pages/presentation-list";
import { homeRoutes } from "./features/home";
import FullscreenLayout from "./common/layouts/fullscreen";
import PageNotFound from "./common/pages/page-not-found";
import Forbidden from "./common/pages/forbidden";
import DashboardLayout from "./common/layouts/dashboard";
import MainSidebar from "./common/layouts/dashboard/main-sidebar";
import { loginRoutes } from "./features/login";
import Demo from "./features/demo/pages";
import { PrivateRoute } from "./common/special-routes";

function App() {
    return (
        <main id="app">
            <Routes>
                {/* Features */}
                <Route
                    path="/dashboard/*"
                    element={<PrivateRoute element={<DashboardLayout sidebarElement={<MainSidebar />} />} />}
                >
                    <Route path="demo" element={<Demo />} />

                    <Route path="presentation-list" element={<PresentationList />} />

                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>

                {/* Login */}
                <Route path="/login/*" element={<FullscreenLayout noPadding />}>
                    {loginRoutes}
                </Route>

                {/* Error */}
                <Route path="/404" element={<FullscreenLayout />}>
                    <Route index element={<PageNotFound />} />
                </Route>

                <Route path="/403" element={<FullscreenLayout />}>
                    <Route index element={<Forbidden />} />
                </Route>

                {/* Home */}
                <Route path="/*" element={<FullscreenLayout />}>
                    {homeRoutes}
                </Route>
            </Routes>
        </main>
    );
}

export default App;
