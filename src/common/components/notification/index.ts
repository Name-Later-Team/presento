import { Id, toast } from "react-toastify";

export class Notification {
    static notifyInfo(msg: string, toastId?: Id) {
        return toast.info(msg, { toastId: toastId });
    }

    static notifySuccess(msg: string, toastId?: Id) {
        return toast.success(msg, { toastId: toastId });
    }

    static notifyWarning(msg: string, toastId?: Id) {
        return toast.warn(msg, { toastId: toastId });
    }

    static notifyError(msg: string, toastId?: Id) {
        return toast.error(msg, { toastId: toastId });
    }

    static notify(msg: string, toastId?: Id) {
        return toast(msg, { toastId: toastId });
    }
}
