import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loading } from "../../components/loading";
import { Notification } from "../../components/notification";

export interface IPrivateRouteProps {
    element: JSX.Element;
}

export function PrivateRoute(props: IPrivateRouteProps) {
    // temporary bypass auth process, modify isAuth to false and isLoading to true when actual using
    const [process] = useState({ isAuth: true, isLoading: false });

    useEffect(() => {
        let timeoutId: number;

        // TODO: call API to check login state
        const checkPermission = async () => {
            try {
                // TODO: uncomment the code below when having an API to check
                // const res = await AuthService.checkLoginState();
                // if (res.code === 200) {
                //     return;
                // }
                // throw new Error("Unhandled error code");
            } catch (error) {
                console.error("PrivateRoute:", error);
                Notification.notifyError("Có lỗi xảy ra trong quá trình kiểm tra");
            }
        };
        checkPermission();

        return () => {
            timeoutId && clearTimeout(timeoutId);
        };
    }, []);

    if (process.isLoading) {
        return (
            <div style={{ height: "100vh" }}>
                <Loading message="Đang kiểm tra quyền truy cập, vui lòng đợi trong giây lát ..." color={"primary"} />
            </div>
        );
    }

    return process.isAuth ? props.element : <Navigate to="/login" />;
}
