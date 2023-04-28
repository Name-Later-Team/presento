import { Alert, Button, Form, InputGroup, Modal, Spinner, Stack } from "react-bootstrap";
import { IBaseComponent, IVotingCodeResponse } from "../../interfaces";
import { useEffect, useState } from "react";
import PresentationService from "../../../services/presentation-service";
import { Notification } from "../notification";
import { ERROR_NOTIFICATION, RESPONSE_CODE, SUCCESS_NOTIFICATION } from "../../../constants";
import { APP_CONSTANTS } from "../../../constants/app-constants";
import FormatUtil from "../../utils/format-util";
import moment from "moment";

// customize moment relative time text to vietnamese
moment.updateLocale("vi", {
    relativeTime: {
        future: "trong %s",
        past: "%s trước",
        s: "vài giây trước",
        ss: "%d giây",
        m: "một phút",
        mm: "%d phút",
        h: "một giờ",
        hh: "%d giờ",
        d: "một ngày",
        dd: "%d ngày",
        w: "một tuần",
        ww: "%d tuần",
        M: "một tháng",
        MM: "%d tháng",
        y: "một năm",
        yy: "%d năm",
    },
});

export interface ISharePresentationModalProps extends IBaseComponent {
    show: boolean;
    onClose: () => void;
    presentationIdentifier?: string;
}

const defaultVotingCodeState = {
    code: "",
    expiresAt: "",
    isValid: false,
};

export default function SharePresentationModal(props: ISharePresentationModalProps) {
    const { show, onClose, presentationIdentifier } = props;
    const [isFetchingCode, setIsFetchingCode] = useState(false);
    const [votingCode, setVotingCode] = useState<IVotingCodeResponse>(defaultVotingCodeState);

    useEffect(() => {
        const fetchVotingCode = async () => {
            setIsFetchingCode(true);
            try {
                const res = await PresentationService.getVotingCodeAsync(presentationIdentifier || "");

                if (res.code === 200) {
                    setIsFetchingCode(false);
                    if (!res.data) return;

                    if (res.data.isValid) {
                        setVotingCode(res.data);
                        return;
                    }
                }

                throw new Error("Unknown http code");
            } catch (err: any) {
                const res = err?.response?.data;
                if (res.code === RESPONSE_CODE.INVALID_VOTING_CODE) {
                    setIsFetchingCode(false);
                    return;
                }

                console.error(err);
                Notification.notifyError(ERROR_NOTIFICATION.FETCH_VOTING_CODE_PROCESS);
                setIsFetchingCode(false);
            }
        };

        if (show) fetchVotingCode();
    }, [show, presentationIdentifier]);

    const handleClose = () => {
        // reset modal state
        setVotingCode(defaultVotingCodeState);
        // close modal
        onClose();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${APP_CONSTANTS.VOTE_APP_DOMAIN}/${presentationIdentifier}`);
        Notification.notifySuccess(SUCCESS_NOTIFICATION.COPIED_LINK_SUCCESS);
    };

    const displayVotingCode = () => {
        if (!votingCode.isValid) {
            return (
                <Alert variant="secondary">
                    Mã bầu chọn đã hết hạn hoặc không có, vui lòng vào giao diện chỉnh sửa hoặc trình chiếu bài trình
                    bày để lấy mã bầu chọn.
                </Alert>
            );
        }

        return (
            <span>
                Mã bầu chọn là
                <span className="fw-bold fs-5 mx-1">{FormatUtil.formatVotingCodeString(votingCode.code)}</span>
                và sẽ hết hạn
                <span className="mx-1">{moment(votingCode.expiresAt).fromNow()}.</span>
            </span>
        );
    };

    return (
        <Modal show={show} onHide={() => handleClose()} backdrop="static" keyboard={false} size="lg" centered>
            <Modal.Body>
                <Modal.Title className="mb-4">Chia sẻ bài trình bày</Modal.Title>

                <Stack>
                    <h6 className="fw-bold">Mã bầu chọn tạm thời</h6>
                    <div className="d-flex align-items-center mb-4">
                        {isFetchingCode && <Spinner className="me-3" animation="border" variant="primary" />}
                        {isFetchingCode ? <span>Đang lấy mã bầu chọn</span> : displayVotingCode()}
                    </div>

                    <h6 className="fw-bold">Đường dẫn trực tiếp</h6>
                    <InputGroup>
                        <Form.Control
                            readOnly
                            defaultValue={`${APP_CONSTANTS.VOTE_APP_DOMAIN}/${presentationIdentifier}`}
                        />
                        <Button onClick={handleCopyLink}>Sao chép</Button>
                    </InputGroup>
                </Stack>

                <hr />
                <Stack direction="horizontal" className="justify-content-end align-items-center">
                    <Button variant="primary" onClick={() => handleClose()}>
                        Đóng
                    </Button>
                </Stack>
            </Modal.Body>
        </Modal>
    );
}
