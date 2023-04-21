import { Route, Routes } from "react-router";
import FullscreenLayout from "./common/layouts/fullscreen";
import PageNotFound from "./common/pages/page-not-found";
import Forbidden from "./common/pages/forbidden";
import DashboardLayout from "./common/layouts/dashboard";
import MainSidebar from "./common/layouts/dashboard/main-sidebar";
import { homeRoutes } from "./features/home";
import { loginRoutes } from "./features/login";
import { PrivateRoute } from "./common/special-routes";
import { createRouteTemplate } from "./common/utils";
import { presentationRoutes } from "./features/presentation";
// import { demoRoutes } from "./features/demo";
import { PresentFeatureContextProvider } from "./common/contexts/present-feature-context";
import { presentationDetailRoutes } from "./features/presentation-detail";

function App() {
    return (
        <main id="app">
            <Routes>
                {/* Features */}
                <Route
                    path="/dashboard/*"
                    element={<PrivateRoute element={<DashboardLayout sidebarElement={<MainSidebar />} />} />}
                >
                    {createRouteTemplate(
                        <>
                            {/* {demoRoutes} */}
                            {presentationRoutes}
                        </>
                    )}
                </Route>

                <Route
                    path="/presentation/*"
                    element={
                        <PrivateRoute
                            element={
                                <PresentFeatureContextProvider>
                                    <FullscreenLayout noPadding />
                                </PresentFeatureContextProvider>
                            }
                        />
                    }
                >
                    {createRouteTemplate(presentationDetailRoutes)}
                </Route>

                {/* Login */}
                <Route path="/login/*" element={<FullscreenLayout noPadding />}>
                    {createRouteTemplate(loginRoutes)}
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
                    {createRouteTemplate(homeRoutes)}
                </Route>
            </Routes>
        </main>
    );
}

export default App;
