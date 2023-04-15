import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

type ICON_TYPE = "success" | "warning" | "error" | "info" | "question";

class Alert {
    _title: string;
    _text: string;
    _icon: ICON_TYPE;
    _confirmButtonText?: string;
    _cancelButtonText?: string;
    _showCloseButton?: boolean;
    _onConfirm?: () => void;
    _onCancel?: () => void;
    _onClose?: () => void;
    _cannotDismiss?: boolean;

    constructor() {
        this._title = "Title";
        this._icon = "success" as ICON_TYPE;
        this._text = "";
    }

    fireAlert() {
        Swal.fire({
            title: this._title,
            icon: this._icon,
            text: this._text,
            confirmButtonText: this._confirmButtonText || "OK",
            cancelButtonText: this._cancelButtonText || "Cancel",
            showCancelButton: this._cancelButtonText !== undefined && this._cancelButtonText !== "",
            showCloseButton: this._showCloseButton !== undefined && this._showCloseButton,
            buttonsStyling: false,
            allowOutsideClick: this._cannotDismiss !== undefined ? !this._cannotDismiss : true,
            customClass: {
                confirmButton: "btn btn-primary mx-2",
                cancelButton: "btn btn-secondary mx-2",
            },
        } as SweetAlertOptions).then((result: SweetAlertResult) => {
            if (result.value) {
                this._onConfirm && this._onConfirm();
                return;
            }
            if (result.dismiss === Swal.DismissReason.cancel) {
                this._onCancel && this._onCancel();
                return;
            }
            if (result.dismiss === Swal.DismissReason.close) {
                this._onClose && this._onClose();
                return;
            }
        });
    }
}

class AlertProxy {
    private _sweetAlert: Alert;

    constructor(alert: Alert) {
        this._sweetAlert = alert;
    }

    fireAlert() {
        this._sweetAlert.fireAlert();
    }
}

export class AlertBuilder {
    private _sweetAlert: Alert;

    constructor() {
        this._sweetAlert = new Alert();
    }

    reset() {
        this._sweetAlert = new Alert();
        return this;
    }

    setTitle(title: string) {
        this._sweetAlert._title = title;
        return this;
    }

    setText(text: string) {
        this._sweetAlert._text = text;
        return this;
    }

    setAlertType(type: ICON_TYPE) {
        this._sweetAlert._icon = type;
        return this;
    }

    setConfirmBtnText(text: string) {
        this._sweetAlert._confirmButtonText = text;
        return this;
    }

    setCancelBtnText(text: string) {
        this._sweetAlert._cancelButtonText = text;
        return this;
    }

    setOnConfirm(fun: () => void) {
        this._sweetAlert._onConfirm = fun;
        return this;
    }

    setOnCancel(fun: () => void) {
        this._sweetAlert._onCancel = fun;
        return this;
    }

    setOnClose(fun: () => void) {
        this._sweetAlert._onClose = fun;
        return this;
    }

    preventDismiss() {
        this._sweetAlert._cannotDismiss = true;
        return this;
    }

    showCloseButton() {
        this._sweetAlert._showCloseButton = true;
        return this;
    }

    getAlert() {
        return new AlertProxy(this._sweetAlert);
    }
}
