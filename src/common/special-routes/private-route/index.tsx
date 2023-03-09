import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import { AuthService } from "../../../services";
import { Loading } from "../../components/loading";

export interface IPrivateRouteProps {
    element: JSX.Element;
}

export function PrivateRoute(props: IPrivateRouteProps) {
    // temporary bypass auth process, modify isAuth to false and isLoading to true when actual using
    const [process] = useState({ isAuth: true, isLoading: false });

    useEffect(() => {
        let timeoutId: number;

        // !current solution: check access token
        // TODO: revise with user role and user permission
        const checkPermission = () => {
            // const accessToken = AuthService.getAccessToken();
            // if (!accessToken) {
            // 	setProcess({ isAuth: false, isLoading: false });
            // 	return;
            // }
            // timeoutId = setTimeout(() => {
            // 	setProcess({ isAuth: true, isLoading: false });
            // }, 500);
        };
        checkPermission();

        return () => {
            timeoutId && clearTimeout(timeoutId);
        };
    }, []);

    if (process.isLoading) {
        return (
            <div style={{ height: "100vh" }}>
                <Loading message="Đang kiểm tra quyền truy cập, vui lòng đợi trong giây lát..." color={"primary"} />
            </div>
        );
    }

    return process.isAuth ? props.element : <Navigate to="/login" />;
}
