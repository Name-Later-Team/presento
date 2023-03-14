import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth-service";
import { Notification } from "../components/notification";
import { IBaseComponent } from "../interfaces";

export interface IUserInfo {
    username?: string;
    email?: string;
    fullname?: string;
    avatar?: string | null;
    userId?: string;
}

interface IAuthContext {
    userInfo: IUserInfo;
    setUserInfo: (userInfo: IUserInfo) => void;
    removeUserInfo: () => void;
    fetchLatestUserInfoFromApi: () => void;
}

interface IAuthContextProvider extends IBaseComponent {}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthContextProvider = (props: IAuthContextProvider) => {
    const navigate = useNavigate();
    const [authInfo, setAuthInfo] = useState<IUserInfo>(() => AuthService.loadUserInfoFromLocal());

    const fetchLatestUserInfoFromApi = async () => {
        try {
            const res = await AuthService.getUserInfo();

            if (res.code === 200) {
                setUserInfo({
                    userId: res.data?.userId,
                    avatar: res.data?.avatar,
                    fullname: res.data?.fullname,
                    email: res.data?.email,
                    username: res.data?.username,
                });

                return;
            }

            throw new Error("Unhandled error code");
        } catch (err) {
            console.error("AuthContextProvider:", err);
            Notification.notifyError("Có lỗi xảy ra khi lấy thông tin người dùng");
        }
    };

    const setUserInfo = (userInfo: IUserInfo) => {
        const newUserInfo = {
            ...authInfo,
            ...userInfo,
        };
        setAuthInfo(newUserInfo);
        AuthService.saveUserInfoToLocal(newUserInfo);
    };

    const removeUserInfo = () => {
        setAuthInfo({});
        AuthService.signOut();
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ userInfo: authInfo, setUserInfo, removeUserInfo, fetchLatestUserInfoFromApi }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (authContext === undefined || authContext === null) {
        throw new Error("There is no existing auth context");
    }
    return authContext;
};
