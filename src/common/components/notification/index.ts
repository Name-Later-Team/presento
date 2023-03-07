import { toast } from "react-toastify";

export class Notification {
	static notifyInfo(msg: string) {
		toast.info(msg);
	}

	static notifySuccess(msg: string) {
		toast.success(msg);
	}

	static notifyWarning(msg: string) {
		toast.warn(msg);
	}

	static notifyError(msg: string) {
		toast.error(msg);
	}

	static notify(msg: string) {
		toast(msg);
	}
}
