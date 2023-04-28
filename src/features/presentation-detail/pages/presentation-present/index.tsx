import { faChevronLeft, faChevronRight, faExpand, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { usePresentFeature } from "../../../../common/contexts/present-feature-context";
import "./style.scss";
import PresentationSlide from "../../components/presentation-slide";
import CustomizedTooltip from "../../../../common/components/tooltip";
import { useGlobalContext } from "../../../../common/contexts";
import { AlertBuilder } from "../../../../common/components/alert";
import PresentationService from "../../../../services/presentation-service";
import { Notification } from "../../../../common/components/notification";
import {
    ERROR_NOTIFICATION,
    RESPONSE_CODE,
    SOCKET_EMIT_EVENT,
    SOCKET_LISTEN_EVENT,
    SOCKET_NAMESPACE,
} from "../../../../constants";
import DataMappingUtil from "../../../../common/utils/data-mapping-util";
import SlideService from "../../../../services/slide-service";
import moment from "moment";
import useSocket, { SOCKET_STATUS } from "../../../../common/hooks/use-socket";
import { IAudienceVoteSocketMsg, IChangeSlideSocketMsg, IQuitSlideSocketMsg } from "../../../../common/interfaces";
import _ from "lodash";

export default function PresentPresentation() {
    // contexts
    const globalContext = useGlobalContext();
    const { presentationState, slideState, resetPresentationState, resetSlideState } = usePresentFeature();
    // custom hooks
    const { socket, status, methods } = useSocket();

    // states
    // const [showChatbox, setShowChatbox] = useState(false);
    // const [showQA, setShowQA] = useState(false);
    const [unreadMsg] = useState(0);
    // use this state to temporary disable actions in this page (block calling APIs)
    // const [allowInteraction, setAllowInteraction] = useState(false);

    // others
    const { presentationId, slideId } = useParams();
    const navigate = useNavigate();

    // refs
    const thisSlideIndex = useRef(-1);
    const gotSlideDetail = useRef(false);
    const gotVotingCode = useRef(false);
    const isInitialRender = useRef(true);
    const joinedRoom = useRef(false); // keep track of calling join-room
    const allowInteraction = useRef(false);
    const calledQuit = useRef(false);

    // find path for next and back slide button
    thisSlideIndex.current = presentationState.slides.findIndex((slide) => slide.id.toString() === slideId?.toString());

    // automatically maximize the screen
    useEffect(() => {
        const maximize = async (minimize: boolean = false) => {
            try {
                if (document.fullscreenElement === null && !minimize) {
                    await document.documentElement.requestFullscreen();
                    return;
                }

                if (document.fullscreenElement && minimize) {
                    await document.exitFullscreen();
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        };

        maximize();

        return () => {
            maximize(true);
        };
    }, []);

    // ================= handle socket section =================
    const handleChangeSlideFromSocket = useCallback(
        (data: IChangeSlideSocketMsg) => {
            if (data?.presentationIdentifier !== presentationId) return;
            if (data?.pace?.active_slide_id?.toString() === slideId?.toString()) return;

            navigate(`/presentation/${presentationId}/${data.pace.active_slide_id}`);
        },
        [presentationId, slideId, navigate]
    );

    const handleQuitSlideFromSocket = useCallback(
        (data: IQuitSlideSocketMsg) => {
            if (data?.presentationIdentifier !== presentationId) return;
            if (calledQuit.current) return;

            allowInteraction.current = false;

            new AlertBuilder()
                .setTitle("Thông báo")
                .setText("Phiên trình chiếu đã kết thúc")
                .setAlertType("info")
                .setConfirmBtnText("OK")
                .setOnConfirm(() => navigate("/dashboard/presentation-list"))
                .preventDismiss()
                .getAlert()
                .fireAlert();
        },
        [presentationId, navigate]
    );

    const handleAudienceVoteFromSocket = useCallback(
        (data: IAudienceVoteSocketMsg) => {
            if (data?.slideId?.toString() !== slideId?.toString()) return;

            const dataResults = data?.results;
            if (!Array.isArray(dataResults)) return;

            const modifiedResults = _.cloneDeep(slideState.result);

            dataResults.forEach((dataItem) => {
                modifiedResults.every((item) => {
                    if (item.key.toString() === dataItem.id.toString()) {
                        item.value = dataItem.score[0] || item.value;
                        return false;
                    }
                    return true;
                });
            });

            resetSlideState({ result: modifiedResults, respondents: data?.respondents });
        },
        [slideState, slideId, resetSlideState]
    );

    // handle events
    useEffect(() => {
        if (!socket) return;

        // reset all event listeners
        socket.removeAllListeners(SOCKET_LISTEN_EVENT.change_slide);
        socket.removeAllListeners(SOCKET_LISTEN_EVENT.quit_slide);
        socket.removeAllListeners(SOCKET_LISTEN_EVENT.audience_vote);

        // init all event listeners
        socket.on(SOCKET_LISTEN_EVENT.change_slide, (data: IChangeSlideSocketMsg) => handleChangeSlideFromSocket(data));
        socket.on(SOCKET_LISTEN_EVENT.quit_slide, (data: IQuitSlideSocketMsg) => handleQuitSlideFromSocket(data));
        socket.on(SOCKET_LISTEN_EVENT.audience_vote, (data: IAudienceVoteSocketMsg) =>
            handleAudienceVoteFromSocket(data)
        );
    }, [socket, handleChangeSlideFromSocket, handleQuitSlideFromSocket, handleAudienceVoteFromSocket]);

    useEffect(() => {
        // init a new websocket when have gotten all the slide detail and the socket is not initialized
        if (gotSlideDetail.current && gotVotingCode.current && status === SOCKET_STATUS.notInitialized) {
            methods.initSocket(SOCKET_NAMESPACE.presentation);
        }

        // join room only 1 time when socket was connected
        if (!joinedRoom.current && socket && status === SOCKET_STATUS.isConnected) {
            socket.emit(SOCKET_EMIT_EVENT.join_room, presentationId);
            joinedRoom.current = true;
        }

        if (joinedRoom.current && status === SOCKET_STATUS.isConnected) {
            // lock calling api when there is no socket connection
            allowInteraction.current = true;
        }
    });
    // ================= end of handling socket section =================

    useEffect(() => {
        const fetchingPresentationDetail = async () => {
            globalContext.blockUI("Đang lấy thông tin");

            const alert = new AlertBuilder()
                .setTitle("Thông báo")
                .setText("Bài trình chiếu này hiện đang không được trình chiếu.")
                .setAlertType("info")
                .setConfirmBtnText("OK")
                .setOnConfirm(() => navigate("/dashboard/presentation-list"))
                .preventDismiss()
                .getAlert();
            const alertNavigate = new AlertBuilder()
                .reset()
                .setTitle("Lỗi")
                .setAlertType("error")
                .setText("Có lỗi xảy ra khi lấy thông tin trang chiếu")
                .setConfirmBtnText("OK")
                .setOnConfirm(() => navigate("/dashboard/presentation-list"));

            try {
                // get presentation detail
                const presentationRes = await PresentationService.getPresentationDetailAsync(presentationId || "");
                if (presentationRes.code === 200) {
                    const data = presentationRes.data as any;
                    const mappedPresentationState = DataMappingUtil.mapPresentationStateFromApiData(
                        presentationState,
                        data
                    );

                    if (!isInitialRender.current)
                        mappedPresentationState.votingCode = { ...presentationState.votingCode };
                    resetPresentationState(mappedPresentationState);

                    // if the slide has not been presented yet (user enters the URL directly into the URL bar)
                    if (data?.pace?.state === "idle") {
                        globalContext.unBlockUI();
                        alert.fireAlert();
                        return Promise.reject();
                    }

                    // get slide detail
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
                }

                throw new Error("Unknown http code");
            } catch (err: any) {
                const res = err?.response?.data;
                if (
                    res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION ||
                    res.code === RESPONSE_CODE.VALIDATION_ERROR
                ) {
                    alertNavigate.setText(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION).getAlert().fireAlert();
                    globalContext.unBlockUI();
                    return Promise.reject();
                }

                if (res.code === RESPONSE_CODE.CANNOT_FIND_SLIDE) {
                    alertNavigate.setText(ERROR_NOTIFICATION.CANNOT_FIND_SLIDE).getAlert().fireAlert();
                    globalContext.unBlockUI();
                    return Promise.reject();
                }

                console.error(err);
                globalContext.unBlockUI();
                return Promise.reject();
            }
        };

        gotSlideDetail.current = false;
        fetchingPresentationDetail()
            .then(() => {
                gotSlideDetail.current = true;
                isInitialRender.current = false;
            })
            .catch(() => (isInitialRender.current = false));
        // eslint-disable-next-line
    }, [slideId]);

    useEffect(() => {
        const fetchVotingCode = async () => {
            try {
                const res = await PresentationService.postVotingCodeAsync(presentationId || "");

                if (res.code === 200) {
                    if (!res.data) return;

                    if (res.data.isValid) {
                        resetPresentationState({ votingCode: { ...res.data } });
                        gotVotingCode.current = true;
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
                return;
            }

            // get voting code if the voting code was expired
            if (moment(presentationState.votingCode.expiresAt).diff(moment()) < 0) {
                fetchVotingCode();
                return;
            }
        }
    });

    const handleTurnOffPresentationMode = async () => {
        if (!allowInteraction.current) return;
        calledQuit.current = true;
        const handleNavigate = () => navigate(`/presentation/${presentationId}/${slideId}/edit`);

        try {
            await PresentationService.updatePresentationPaceAsync(presentationId || "", null, "quit");

            handleNavigate();
        } catch (err: any) {
            const res = err?.response?.data;

            if (res.code === RESPONSE_CODE.QUIT_SLIDE_PERMISSION) {
                handleNavigate();
                return;
            }

            console.error(err);
            Notification.notifyError(ERROR_NOTIFICATION.UPDATE_PRESENTATION_PACE_PROCESS);
        }
    };

    const changeSlide = async (next: boolean) => {
        if (!allowInteraction.current) return;
        const targetSlideId = next
            ? presentationState.slides[thisSlideIndex.current + 1].id
            : presentationState.slides[thisSlideIndex.current - 1].id;
        try {
            await PresentationService.updatePresentationPaceAsync(
                presentationId || "",
                targetSlideId || "",
                "change_slide"
            );

            navigate(`/presentation/${presentationId}/${targetSlideId}`);
        } catch (error: any) {
            const res = error?.response?.data;

            if (res.code === RESPONSE_CODE.CHANGE_SLIDE_PERMISSION) {
                new AlertBuilder()
                    .setTitle("Thông báo")
                    .setText("Bài trình chiếu này hiện đang không được trình chiếu.")
                    .setAlertType("info")
                    .setConfirmBtnText("OK")
                    .setOnConfirm(() => navigate("/dashboard/presentation-list"))
                    .preventDismiss()
                    .getAlert()
                    .fireAlert();
                return;
            }
            Notification.notifyError(ERROR_NOTIFICATION.UPDATE_PRESENTATION_PACE_PROCESS);
            console.error(error);
        }
    };

    const toggleFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                return;
            }

            await document.documentElement.requestFullscreen();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            <div className="present-presentation">
                {/* slide content */}
                <PresentationSlide />

                {/* control components (right side) */}
                <div className="present-presentation__sidebar-right">
                    <div
                        className={`present-presentation__control-bar-right${
                            unreadMsg !== 0 ? " present-presentation__control-bar-right--visible" : ""
                        }`}
                    >
                        <Stack className="py-2 fs-4" gap={3}>
                            <button
                                className="control-bar__action-button"
                                id="next-button"
                                disabled={
                                    thisSlideIndex.current === -1 ||
                                    thisSlideIndex.current === presentationState.slides.length - 1
                                }
                                onClick={() => changeSlide(true)}
                            >
                                <FontAwesomeIcon className="control-bar__action-icon" icon={faChevronRight} />
                            </button>
                            <CustomizedTooltip place="left" anchorSelect="#next-button" content="Trang sau" />

                            <button
                                className="control-bar__action-button"
                                id="back-button"
                                disabled={thisSlideIndex.current === -1 || thisSlideIndex.current === 0}
                                onClick={() => changeSlide(false)}
                            >
                                <FontAwesomeIcon className="control-bar__action-icon" icon={faChevronLeft} />
                            </button>
                            <CustomizedTooltip place="left" anchorSelect="#back-button" content="Trang trước" />

                            {/* <button
                                className="control-bar__action-button"
                                id="open-chat-button"
                                onClick={() => {
                                    setUnreadMsg(0);
                                    setShowChatbox(true);
                                }}
                            >
                                <FontAwesomeIcon className="control-bar__action-icon" icon={faComment} /> */}
                            {/* badge to display the number of unread messages */}
                            {/* {unreadMsg === 0 ? null : (
                                    <Badge className="control-bar__chat-btn-badge" bg="danger">
                                        {unreadMsg}
                                    </Badge>
                                )}
                            </button>
                            <CustomizedTooltip place="left" anchorSelect="#open-chat-button" content="Hộp trò chuyện" /> */}

                            {/* Q&A feature */}
                            {/* <button
                                className="control-bar__action-button"
                                id="open-qa-button"
                                onClick={() => setShowQA(true)}
                            >
                                <FontAwesomeIcon className="control-bar__action-icon" icon={faQuestion} />
                            </button>
                            <CustomizedTooltip place="left" anchorSelect="#open-qa-button" content="Hộp câu hỏi" /> */}

                            {/* Maximize screen */}
                            <button
                                className="control-bar__action-button"
                                id="maximize-button"
                                onClick={() => toggleFullscreen()}
                            >
                                <FontAwesomeIcon className="control-bar__action-icon" icon={faExpand} />
                            </button>
                            <CustomizedTooltip
                                place="left"
                                anchorSelect="#maximize-button"
                                content="Đóng/mở toàn màn hình"
                            />
                        </Stack>
                    </div>
                </div>

                {/* control components (left side) */}
                <div className="present-presentation__sidebar-left">
                    <div className="present-presentation__control-bar-left">
                        <Stack>
                            <button
                                id="close-button"
                                className="control-bar__action-button"
                                onClick={() => handleTurnOffPresentationMode()}
                            >
                                <FontAwesomeIcon className="control-bar__action-icon" icon={faXmark} />
                            </button>
                            <CustomizedTooltip place="right" anchorSelect="#close-button" content="Tắt trình chiếu" />
                        </Stack>
                    </div>
                </div>

                {/* modals */}
                {/* <ChatBoxModal
					show={showChatbox}
					hideModal={() => setShowChatbox(false)}
					notify={() => setUnreadMsg((prev) => prev + 1)}
				/> */}

                {/* <QAModal show={showQA} hideModal={() => setShowQA(false)} /> */}
            </div>
        </div>
    );
}
