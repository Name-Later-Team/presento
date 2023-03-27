import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ERROR_NOTIFICATION } from "../../../constants";
import AuthService from "../../../services/auth-service";
import { Loading } from "../../components/loading";
import { Notification } from "../../components/notification";
import { useAuth } from "../../contexts/auth-context";

export interface IPrivateRouteProps {
    element: JSX.Element;
}

export function PrivateRoute(props: IPrivateRouteProps) {
    // temporary bypass auth process, modify isAuth to false and isLoading to true when actual using
    const [process, setProcess] = useState({ isAuth: false, isLoading: true });
    const { setUserInfo } = useAuth();

    useEffect(() => {
        let timeoutId: number;

        // TODO: call API to check login state
        const checkPermission = async () => {
            try {
                const res = await AuthService.checkLoginState();

                if (res.code === 200) {
                    setUserInfo({
                        avatar: res.data?.avatar,
                        email: res.data?.email,
                        fullname: res.data?.fullname,
                        userId: res.data?.userId,
                        username: res.data?.username,
                    });
                    setProcess({ isAuth: true, isLoading: false });
                    return;
                }

                throw new Error("Unhandled error code");
            } catch (error) {
                console.error("PrivateRoute:", error);
                Notification.notifyError(ERROR_NOTIFICATION.CHECK_LOGIN_PROCESS);
            }
        };
        checkPermission();

        return () => {
            timeoutId && clearTimeout(timeoutId);
        };
        // eslint-disable-next-line
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
