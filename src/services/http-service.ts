import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { AlertBuilder } from "../common/components/alert";
import { IBaseResponse } from "../common/interfaces";
import { COMMON_CONSTANTS, RESPONSE_CODE } from "../constants";
import { APP_CONSTANTS } from "../constants/app-constants";
import { TokenService } from "./token-service";

export const axiosInstance = axios.create({
    baseURL: APP_CONSTANTS.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        let cloneConfig = { ...config };
        const token = TokenService.getToken();
        if (token) {
            if (!cloneConfig.headers) {
                cloneConfig.headers = {} as AxiosRequestHeaders;
            }

            cloneConfig.headers["Authorization"] = `Bearer ${token}`;
        }
        return cloneConfig;
    },
    function (error: AxiosError) {
        // Do something with request error
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (!(error instanceof AxiosError)) {
            return Promise.reject(error);
        }

        const { response } = error;
        if (!response) {
            return Promise.reject(error);
        }

        const { status } = response;
        if (status === 401) {
            const data = response.data;

            // these code will make user go to login screen to sign in again
            // TODO: handle refresh token flow if neccessary
            const codeList = [RESPONSE_CODE.INVALID_TOKEN, RESPONSE_CODE.MISSING_TOKEN];
            if (codeList.includes(data.code)) {
                localStorage.clear();
                new AlertBuilder()
                    .reset()
                    .setTitle("Phiên đăng nhập hết hạn")
                    .setText("Thông tin đăng nhập không còn hợp lệ, bạn sẽ được điều hướng về trang đăng nhập")
                    .setAlertType("warning")
                    .setConfirmBtnText("OK")
                    .preventDismiss()
                    .setOnConfirm(() => {
                        window.location.href = `${window.location.origin}/login`;
                    })
                    .getAlert()
                    .fireAlert();
                return Promise.reject("unauthorized");
            }

            return Promise.resolve(response);
        }

        if (status === 403) {
            const data = response.data;
            const codeList = [RESPONSE_CODE.INVALID_RESOURCE_PERMISSION];

            if (codeList.includes(data.code)) {
                toast.error("Bạn không có quyền thực hiện chức năng này");
                return Promise.reject("forbidden");
            }

            return Promise.resolve(response);
        }

        if (status === 400 || status === 403) {
            return Promise.resolve(response);
        }

        if (status === 500) {
            const data = response.data;
            toast.error(COMMON_CONSTANTS.API_MESSAGE.INTERNAL_ERROR);
            return Promise.reject(data?.errors);
        }

        toast.error(COMMON_CONSTANTS.API_MESSAGE.INTERNAL_ERROR);
        return Promise.reject(error);
    }
);

export class HttpService {
    public static async get<T>(path: string, extraConfig?: AxiosRequestConfig): Promise<IBaseResponse<T>> {
        return this.handleAPIResponse(await axiosInstance.get<IBaseResponse<T>>(path, extraConfig));
    }

    public static async post<T>(
        path: string,
        payload: any,
        extraConfig?: AxiosRequestConfig
    ): Promise<IBaseResponse<T>> {
        return this.handleAPIResponse(await axiosInstance.post<IBaseResponse<T>>(path, payload, extraConfig));
    }

    public static async delete<T>(path: string, extraConfig?: AxiosRequestConfig): Promise<IBaseResponse<T>> {
        return this.handleAPIResponse(await axiosInstance.delete<IBaseResponse<T>>(path, extraConfig));
    }

    public static async put<T>(
        path: string,
        payload: any,
        extraConfig?: AxiosRequestConfig
    ): Promise<IBaseResponse<T>> {
        return this.handleAPIResponse(await axiosInstance.put<IBaseResponse<T>>(path, payload, extraConfig));
    }

    public static async patch<T>(
        path: string,
        payload: any,
        extraConfig?: AxiosRequestConfig
    ): Promise<IBaseResponse<T>> {
        return this.handleAPIResponse(await axiosInstance.patch<IBaseResponse<T>>(path, payload, extraConfig));
    }

    private static handleAPIResponse(response: AxiosResponse<any>): any {
        return response.data;
    }
}
