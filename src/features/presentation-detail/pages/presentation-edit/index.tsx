import { Alert, Button, Col, Row, Stack } from "react-bootstrap";
import { SingleValue } from "react-select";
import { BaseSelect } from "../../../../common/components/select";
import { initSlideState, usePresentFeature } from "../../../../common/contexts/present-feature-context";
import PresentationSlide from "../../components/presentation-slide";
import HeadingConfig from "../../components/slide-config/heading";
import MultipleChoiceConfig from "../../components/slide-config/multiple-choice";
import ParagraphConfig from "../../components/slide-config/paragraph";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import ResetResultModal, { IResetResultModalProps } from "../../components/reset-result-modal";
import { useGlobalContext } from "../../../../common/contexts";
import SlideService from "../../../../services/slide-service";
import { useParams } from "react-router-dom";
import DataMappingUtil from "../../../../common/utils/data-mapping-util";
import { ERROR_NOTIFICATION, RESPONSE_CODE } from "../../../../constants";
import { Notification } from "../../../../common/components/notification";
import PresentationService from "../../../../services/presentation-service";
import moment from "moment";

interface ISlideTypeOption {
    value: string;
    label: string;
}

const slideTypeLabels: { [type: string]: string } = {
    multiple_choice: "Multiple Choice",
    heading: "Tiêu đề",
    paragraph: "Đoạn văn",
};

const slideTypeConfigComponents: { [type: string]: JSX.Element } = {
    multiple_choice: <MultipleChoiceConfig />,
    heading: <HeadingConfig />,
    paragraph: <ParagraphConfig />,
};

const slideTypeOptions: ISlideTypeOption[] = [
    { value: "multiple_choice", label: slideTypeLabels["multiple_choice"] },
    { value: "heading", label: slideTypeLabels["heading"] },
    { value: "paragraph", label: slideTypeLabels["paragraph"] },
];

const defaultResetResultModal: IResetResultModalProps = {
    show: false,
    onClose: () => {},
    onSuccess: () => {},
};

export default function EditPresentation() {
    // contexts
    const { slideState, presentationState, indicators, changeSlideState, resetSlideState, resetPresentationState } =
        usePresentFeature();
    const globalContext = useGlobalContext();

    // states
    const [resetResultModal, setResetResultModal] = useState<IResetResultModalProps>(defaultResetResultModal);
    const [rerender, setRerender] = useState(false);

    // refs
    const gotSlideDetail = useRef(false);

    // libs
    const { presentationId, slideId } = useParams();

    const slideType: ISlideTypeOption = {
        value: slideState.type,
        label: slideTypeLabels[slideState.type],
    };

    // effect that happens when change slide within the edit page
    useEffect(() => {
        const fetchingSlideDetail = async () => {
            globalContext.blockUI("Đang lấy thông tin");
            try {
                const res = await SlideService.getSlideDetailAsync(presentationId || "", slideId || "");

                if (res.code === 200) {
                    const resData = res?.data;
                    if (!resData) {
                        globalContext.unBlockUI();
                        return;
                    }
                    const mappedSlideDetail = DataMappingUtil.mapSlideStateFromApiData(slideState, resData);
                    resetSlideState(mappedSlideDetail);
                    globalContext.unBlockUI();
                    return;
                }

                throw new Error("Unknown http code");
            } catch (err: any) {
                const res = err?.response?.data;
                if (res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION) {
                    Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION);
                    globalContext.unBlockUI();
                    return Promise.reject();
                }

                if (res.code === RESPONSE_CODE.VALIDATION_ERROR || res.code === RESPONSE_CODE.CANNOT_FIND_SLIDE) {
                    Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_SLIDE);
                    globalContext.unBlockUI();
                    return Promise.reject();
                }

                console.error(err);
                Notification.notifyError(ERROR_NOTIFICATION.FETCH_SLIDE_DETAIL);
                globalContext.unBlockUI();
                return Promise.reject();
            }
        };

        gotSlideDetail.current = false;
        fetchingSlideDetail()
            .then(() => (gotSlideDetail.current = true))
            .catch(() => {});
        // eslint-disable-next-line
    }, [presentationId, slideId, rerender]);

    useEffect(() => {
        const fetchVotingCode = async () => {
            try {
                const res = await PresentationService.postVotingCodeAsync(presentationId || "");

                if (res.code === 200) {
                    if (!res.data) return;

                    if (res.data.isValid) {
                        resetPresentationState({ votingCode: { ...res.data } });
                        return;
                    }
                }

                throw new Error("Unknown http code");
            } catch (err) {
                console.error(err);
                Notification.notifyError(ERROR_NOTIFICATION.FETCH_VOTING_CODE_PROCESS);
            }
        };

        // called voting code api when have got slide detail
        if (gotSlideDetail.current) {
            // get voting code if this is none
            if (presentationState.votingCode.code === "") {
                fetchVotingCode();
            }

            // get voting code if the voting code was expired
            if (moment(presentationState.votingCode.expiresAt).diff(moment()) < 0) {
                fetchVotingCode();
            }
        }
    });

    const handleSlideTypeChange = (newSlideType: SingleValue<{ value: string; label: string }>) => {
        const oldSlideState = { ...slideState };
        changeSlideState({
            ...initSlideState,
            type: newSlideType?.value || "",
            position: oldSlideState.position,
            id: oldSlideState.id,
            presentationId: oldSlideState.presentationId,
            presentationSeriesId: oldSlideState.presentationSeriesId,
            createdAt: oldSlideState.createdAt,
            updatedAt: oldSlideState.updatedAt,
        });
        // change the preview icon of the slide
        const newSlides = [...presentationState.slides];
        for (let element of newSlides) {
            if (element.id.toString() === oldSlideState.id.toString()) {
                element.type = newSlideType?.value || "";
                resetPresentationState({
                    slides: newSlides,
                });
                break;
            }
        }
    };

    const handleResetResult = () => {
        setResetResultModal({
            show: true,
            onClose: () => setResetResultModal(defaultResetResultModal),
            onSuccess: () => {
                setResetResultModal(defaultResetResultModal);
                setRerender((prev) => !prev);
            },
            presentationIdentifier: presentationState.identifier,
            slideId: slideState.id,
        });
    };

    return (
        <>
            <Row className="edit-presentation">
                <Col xxl={9} xl={8} lg={8} md={12} className="edit-presentation__col edit-presentation__col--left">
                    {indicators.hasResult && (
                        <Alert className="d-flex justify-content-between flex-wrap gap-3 m-0 mb-3" variant="primary">
                            <div className="d-flex align-items-center">
                                <p className="m-0 me-3">
                                    <FontAwesomeIcon icon={faSquarePollVertical} fontSize="1.4rem" />
                                </p>
                                <p className="m-0">
                                    Một số tùy chọn thay đổi nội dung bị hạn chế do trang trình bày đã có kết quả, vui
                                    lòng làm mới kết quả nếu muốn chỉnh sửa.
                                </p>
                            </div>
                            <div className="flex-grow-1 d-flex justify-content-end">
                                <Button variant="primary" onClick={handleResetResult}>
                                    Làm mới kết quả
                                </Button>
                            </div>
                        </Alert>
                    )}

                    <PresentationSlide />
                </Col>
                <Col xxl={3} xl={4} lg={4} md={12} className="edit-presentation__col edit-presentation__col--right">
                    <div className="edit-presentation__slide-config">
                        <Stack>
                            <h4 className="text-uppercase fw-bold text-primary m-0 mt-1 mb-3">Nội dung</h4>

                            <hr className="m-0 mb-3" />

                            <p className="m-0 mb-2">Loại trang trình bày</p>

                            <BaseSelect
                                options={slideTypeOptions}
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        minWidth: "200px",
                                    }),
                                }}
                                onChange={handleSlideTypeChange}
                                value={slideType}
                                isDisabled={indicators.hasResult}
                            />

                            <hr className="my-3" />

                            {slideTypeConfigComponents[slideState.type]}
                        </Stack>
                    </div>
                </Col>
            </Row>

            <ResetResultModal {...resetResultModal} />
        </>
    );
}
