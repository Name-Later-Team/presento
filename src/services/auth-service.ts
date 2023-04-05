import { IUserInfo } from "../common/contexts/auth-context";
import { HttpService } from "./http-service";

export default class AuthService {
    static checkLoginState() {
        return HttpService.get<any>("/api/auth/state");
    }

    static getLoginUrl() {
        return HttpService.get<any>("/api/auth/login_url");
    }

    static getSignupUrl() {
        return HttpService.get<any>("/api/auth/signup");
    }

    static postAuthorizationCode(code: string) {
        return HttpService.post<any>("/api/auth/token", {
            code: code,
        });
    }

    static getUserInfo() {
        return HttpService.get<any>("/api/auth/userinfo");
    }

    static saveUserInfoToLocal(userInfo: IUserInfo) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }

    static loadUserInfoFromLocal(): IUserInfo {
        const userInfo = localStorage.getItem("userInfo");

        return userInfo === null ? {} : (JSON.parse(userInfo) as IUserInfo);
    }

    private static clearUserInfoFromLocal() {
        localStorage.removeItem("userInfo");
    }

    static signOut() {
        this.clearUserInfoFromLocal();
        return HttpService.get("/api/auth/logout");
    }
}
