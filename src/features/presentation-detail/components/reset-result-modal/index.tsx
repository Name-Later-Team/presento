import { Button, Form, Modal, Spinner, Stack } from "react-bootstrap";
import { IBaseComponent, IBaseResponse } from "../../../../common/interfaces";
import { useState } from "react";
import "./style.scss";
import PresentationService from "../../../../services/presentation-service";
import SlideService from "../../../../services/slide-service";
import { ERROR_NOTIFICATION, RESPONSE_CODE, SUCCESS_NOTIFICATION } from "../../../../constants";
import { Notification } from "../../../../common/components/notification";

export interface IResetResultModalProps extends IBaseComponent {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    presentationIdentifier?: string;
    slideId?: string;
}

const enum RESET_OPTIONS {
    reset_all_presentation,
    reset_only_slide,
}

const optionsList = [
    {
        label: "Làm mới kết quả cho toàn bộ trang chiếu",
        value: RESET_OPTIONS.reset_all_presentation,
    },
    {
        label: "Làm mới kết quả cho trang chiếu hiện tại",
        value: RESET_OPTIONS.reset_only_slide,
    },
];

const defaultResetOption = RESET_OPTIONS.reset_all_presentation;

export default function ResetResultModal(props: IResetResultModalProps) {
    const { show, onClose, onSuccess, presentationIdentifier, slideId } = props;
    const [selectedResetOption, setSelectedResetOption] = useState<RESET_OPTIONS>(defaultResetOption);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSelected = optionsList.some((option) => option.value === selectedResetOption);

    const handleClose = () => {
        setSelectedResetOption(defaultResetOption);
        onClose && onClose();
    };

    const handleSuccessAndClose = () => {
        setSelectedResetOption(defaultResetOption);
        onSuccess && onSuccess();
    };

    const handleResetResult = async () => {
        if (!isSelected) return;

        let promise: Promise<IBaseResponse<any>> | null = null;

        switch (selectedResetOption) {
            case RESET_OPTIONS.reset_all_presentation: {
                promise = PresentationService.resetPresentationResult(presentationIdentifier || "");
                break;
            }
            case RESET_OPTIONS.reset_only_slide: {
                promise = SlideService.resetSlideResult(presentationIdentifier || "", slideId || "");
                break;
            }
            default: {
                return;
            }
        }

        if (promise === null) return;

        try {
            setIsSubmitting(true);
            await promise;
            setIsSubmitting(false);

            Notification.notifySuccess(SUCCESS_NOTIFICATION.RESET_RESULT_SUCCESS);
            handleSuccessAndClose();
        } catch (error: any) {
            const res = error?.response?.data;

            if (res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION) {
                setIsSubmitting(false);
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION);
                return;
            }

            if (res.code === RESPONSE_CODE.CANNOT_FIND_SLIDE) {
                setIsSubmitting(false);
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_SLIDE);
                return;
            }

            console.error("ResetResultModal:", error);
            setIsSubmitting(false);
            Notification.notifyError(ERROR_NOTIFICATION.RESET_RESULT_PROCESS);
            return;
        }
    };

    return (
        <Modal show={show} onHide={() => handleClose()} backdrop="static" keyboard={false} size="lg" centered>
            <Modal.Body>
                <Modal.Title className="mb-3">Làm mới kết quả</Modal.Title>

                <Form>
                    <Stack>
                        <p className="m-0 mb-4 fst-italic">
                            Bạn có thể chọn trình chiếu bài trình bày này với kết quả hiện tại hoặc tiến hành làm mới
                            kết quả để thực hiện một phiên trình bày mới. Hãy chắc chắn rằng bạn đã xuất kết quả ra tập
                            tin PDF trước khi làm mới nếu bạn có nhu cầu lưu trữ kết quả hiện tại.
                        </p>

                        <div className="custom-form-check__container mb-3">
                            {optionsList.map((option) => (
                                <Form.Check
                                    key={option.value}
                                    id={`reset-option-${option.value}`}
                                    type="radio"
                                    className={`custom-form-check${
                                        option.value === selectedResetOption ? " custom-form-check--active" : ""
                                    }`}
                                >
                                    <label
                                        htmlFor={`reset-option-${option.value}`}
                                        className="custom-form-check__label"
                                    >
                                        <Form.Check.Input
                                            className="custom-form-check__input"
                                            checked={option.value === selectedResetOption}
                                            type="radio"
                                            onChange={() => setSelectedResetOption(option.value)}
                                        />
                                        {option.label}
                                    </label>
                                </Form.Check>
                            ))}

                            {!isSelected && (
                                <Form.Text className="text-danger">Vui lòng chọn MỘT loại làm mới kết quả</Form.Text>
                            )}
                        </div>
                    </Stack>

                    <Stack direction="horizontal" className="justify-content-between align-items-center mt-3">
                        <Stack direction="horizontal" className="align-items-center" gap={2}>
                            {/* <Button disabled={isSubmitting} variant="secondary" onClick={() => handleClose()}>
                                Xem kết quả
                            </Button> */}
                        </Stack>
                        <Stack direction="horizontal" className="align-items-center" gap={2}>
                            <Button disabled={isSubmitting} variant="light" onClick={() => handleClose()}>
                                Đóng
                            </Button>
                            <Button disabled={isSubmitting} variant="primary" onClick={handleResetResult}>
                                {isSubmitting ? <Spinner animation="border" role="status" size="sm" /> : "Làm mới"}
                            </Button>
                        </Stack>
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
