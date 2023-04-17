import { Id, ToastOptions, toast } from "react-toastify";

export class Notification {
    static notifyInfo(msg: React.ReactNode, toastOptions?: ToastOptions) {
        return toast.info<React.ReactNode>(msg, toastOptions);
    }

    static notifySuccess(msg: React.ReactNode, toastOptions?: ToastOptions) {
        return toast.success<React.ReactNode>(msg, toastOptions);
    }

    static notifyWarning(msg: React.ReactNode, toastOptions?: ToastOptions) {
        return toast.warn<React.ReactNode>(msg, toastOptions);
    }

    static notifyError(msg: React.ReactNode, toastOptions?: ToastOptions) {
        return toast.error<React.ReactNode>(msg, toastOptions);
    }

    static notify(msg: React.ReactNode, toastOptions?: ToastOptions) {
        return toast<React.ReactNode>(msg, toastOptions);
    }

    static dismiss(toastId: Id) {
        toast.dismiss(toastId);
    }
}
