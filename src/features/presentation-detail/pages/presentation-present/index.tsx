import { faChevronLeft, faChevronRight, faExpand, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
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
import { ERROR_NOTIFICATION, RESPONSE_CODE } from "../../../../constants";
import DataMappingUtil from "../../../../common/utils/data-mapping-util";
import SlideService from "../../../../services/slide-service";
import moment from "moment";

export default function PresentPresentation() {
    // contexts
    const globalContext = useGlobalContext();
    const { presentationState, slideState, resetPresentationState, resetSlideState } = usePresentFeature();
    // const { socket, initNewSocket, closeCurrentSocket } = useSocket();

    // states
    // const [showChatbox, setShowChatbox] = useState(false);
    // const [showQA, setShowQA] = useState(false);
    const [unreadMsg] = useState(0);
    // use this state to temporary disable actions in this page (block calling APIs)
    const [allowInteraction] = useState(true);

    // others
    const { presentationId, slideId } = useParams();
    const navigate = useNavigate();

    // refs
    const thisSlideIndex = useRef(-1);
    const gotSlideDetail = useRef(false);
    const isInitialRender = useRef(true);
    // const joinedRoom = useRef(false); // keep track of calling join-room

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
    // handle events
    // const doActionFromSocket = (data: any) => {
    // 	if (data?.action === "change_slide") {
    // 		navigate(`/presentations/${data?.seriesId}/${data?.pace?.active}`);
    // 		return;
    // 	}

    // 	if (data?.action === "quit") {
    // 		handleTurnOffPresentationMode(false);
    // 		return;
    // 	}
    // };

    // const changeResultFromSocket = (data: any) => {
    // 	if (data?.slideAdminKey === slideState.adminKey) {
    // 		const choices: any = [];
    // 		slideState.options.forEach((option, idx) => {
    // 			choices?.push({
    // 				id: option.key,
    // 				label: option.value,
    // 				position: idx,
    // 				correctAnswer: option.key === slideState.selectedOption,
    // 			});
    // 		});

    // 		const processedResult = handleResultData(choices, JSON.parse(data?.results));
    // 		changeSlideState({
    // 			...slideState,
    // 			respondents: data?.respondents,
    // 			options: processedResult.options,
    // 			result: processedResult.results,
    // 			selectedOption: processedResult.selectedOption,
    // 		});
    // 	}
    // };

    // effect that runs 1 time
    // useEffect(() => {
    // 	const pageSocket = initNewSocket(SOCKET_NAMESPACES.PRESENT);

    // 	// init events
    // 	pageSocket.on(SOCKET_LISTEN_EVENTS.PRESENT, doActionFromSocket);
    // 	pageSocket.on(SOCKET_LISTEN_EVENTS.VOTE, changeResultFromSocket);

    // 	return () => {
    // 		closeCurrentSocket();
    // 	};
    // }, []);

    // change listeners when dependencies change
    // useEffect(() => {
    // 	socket?.removeAllListeners(SOCKET_LISTEN_EVENTS.PRESENT);
    // 	socket?.removeAllListeners(SOCKET_LISTEN_EVENTS.VOTE);

    // 	// init events
    // 	socket?.on(SOCKET_LISTEN_EVENTS.PRESENT, doActionFromSocket);
    // 	socket?.on(SOCKET_LISTEN_EVENTS.VOTE, changeResultFromSocket);
    // }, [slideState.adminKey]);

    // work around strictmode
    // useEffect(() => {
    // 	return () => {
    // 		closeCurrentSocket();
    // 	};
    // }, [socket]);

    // join room only 1 time when socket was connected
    // useEffect(() => {
    // 	if (!joinedRoom.current && socket?.connected && presentationState.voteKey !== "") {
    // 		socket?.emit(SOCKET_EMIT_EVENTS.JOIN_ROOM, presentationState.voteKey);
    // 		joinedRoom.current = true;
    // 	}
    // });
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

    const handleTurnOffPresentationMode = async () => {
        if (!allowInteraction) return;
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
        if (!allowInteraction) return;
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
