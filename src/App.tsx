import { Navigate, Route, Routes } from "react-router";
import PresentationList from "./features/presentation/pages/presentation-list";
import { homeRoutes } from "./features/home";
import FullscreenLayout from "./common/layouts/fullscreen";
import PageNotFound from "./common/pages/page-not-found";
import Forbidden from "./common/pages/forbidden";
import DashboardLayout from "./common/layouts/dashboard";
import MainSidebar from "./common/layouts/dashboard/main-sidebar";

function App() {
    return (
        <main id="app">
            <Routes>
                {/* Features */}
                <Route path="/dashboard/*" element={<FullscreenLayout noPadding />}>
                    <Route path="demo" element={<DashboardLayout sidebarElement={<MainSidebar />} />}>
                        <Route index element={<PresentationList />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/404" replace />} />
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
