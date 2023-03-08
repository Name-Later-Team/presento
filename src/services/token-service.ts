export class TokenService {
    static getToken() {
        const infoToken = localStorage.getItem("token");
        if (!infoToken) {
            return null;
        }

        try {
            const token = JSON.parse(infoToken);
            return token;
        } catch (error) {
            return null;
        }
    }

    static setLocalToken(data: any): void {
        localStorage.setItem("token", JSON.stringify(data));
    }

    static setLocalTokenExpiredTime(exp: string): void {
        localStorage.setItem("token_expired_time", exp);
    }

    static clearLocalToken() {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expired_time");
    }
}
