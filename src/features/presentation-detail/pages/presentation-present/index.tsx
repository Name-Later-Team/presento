import { faChevronLeft, faChevronRight, faExpand, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import {
    IPresentationPace,
    IPresentationSlide,
    usePresentFeature,
} from "../../../../common/contexts/present-feature-context";
import "./style.scss";
import PresentationSlide from "../../components/presentation-slide";
import CustomizedTooltip from "../../../../common/components/tooltip";
import { useGlobalContext } from "../../../../common/contexts";
import { AlertBuilder } from "../../../../common/components/alert";
import PresentationService from "../../../../services/presentation-service";
import { Notification } from "../../../../common/components/notification";
import { ERROR_NOTIFICATION } from "../../../../constants";

export default function PresentPresentation() {
    // contexts
    const globalContext = useGlobalContext();
    const { presentationState, slideState, changePresentationState, changeSlideState } = usePresentFeature();
    // const { socket, initNewSocket, closeCurrentSocket } = useSocket();

    // states
    // const [showChatbox, setShowChatbox] = useState(false);
    // const [showQA, setShowQA] = useState(false);
    const [unreadMsg] = useState(0);

    // others
    const { presentationId, slideId } = useParams();
    const navigate = useNavigate();

    // refs
    const thisSlideIndex = useRef(-1);
    // const joinedRoom = useRef(false); // keep track of calling join-room

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

    // process result and choices received from api
    const handleResultData: (
        choices: any,
        resultsData: any
    ) => {
        options: { key: string; value: string }[];
        results: { key: string; value: number }[];
        selectedOption: string;
    } = (choices, resultsData) => {
        const options: { key: string; value: string }[] = [];
        const results: { key: string; value: number }[] = [];
        let selectedOption = "";

        if (Array.isArray(choices)) {
            const flag = Array.isArray(resultsData);

            choices.sort((a, b) => a?.position - b?.position);

            let haveCorrectAnswer = false;

            choices.forEach((item, idx) => {
                options.push({
                    key: item?.id ?? idx,
                    value: item?.label ?? "",
                });
                const tempResult = {
                    key: item?.id ?? idx,
                    value: 0,
                };

                if (flag) {
                    tempResult.value =
                        (resultsData as any[]).find((element) => element?.id === item?.id)?.score[0] ?? 0;
                }

                results.push(tempResult);
                if (item?.correctAnswer === true) {
                    haveCorrectAnswer = true;
                    selectedOption = item?.id;
                }
            });

            if (!haveCorrectAnswer) selectedOption = "";
        }
        return {
            options: options,
            results: results,
            selectedOption: selectedOption,
        };
    };

    useEffect(() => {
        const fetchingPresentationDetail = async () => {
            globalContext.blockUI("Đang lấy thông tin");
            const alert = new AlertBuilder()
                .setTitle("Thông báo")
                .setText("Bài trình chiếu này hiện đang không được trình chiếu.")
                .setAlertType("info")
                .setConfirmBtnText("OK")
                .setOnConfirm(() => navigate("/"))
                .preventDismiss()
                .getAlert();
            // const alertNavigate = new AlertBuilder()
            //     .setAlertType("error")
            //     .setConfirmBtnText("Về trang chủ")
            //     .preventDismiss()
            //     .setOnConfirm(() => navigate("./"));
            const kickAlert = new AlertBuilder()
                .setTitle("Thông báo")
                .setText("Bạn không có quyền truy cập trang này")
                .setAlertType("error")
                .setConfirmBtnText("OK")
                .setOnConfirm(() => navigate("/", { replace: true }))
                .preventDismiss()
                .getAlert();
            try {
                // get presentation detail
                const presentationRes = await PresentationService.getPresentationDetailAsync(presentationId || "");
                if (presentationRes.code === 200) {
                    const data = presentationRes.data as any;
                    const slideList = data.slides;
                    if (data?.permission?.presentationRole === null && data?.permission?.groupRole === null) {
                        kickAlert.fireAlert();
                        globalContext.unBlockUI();
                        return;
                    }
                    if (data?.permission?.presentationRole === "collaborator" && data?.permission?.groupRole === null) {
                        kickAlert.fireAlert();
                        globalContext.unBlockUI();
                        return;
                    }
                    const mappedSlideList: IPresentationSlide[] = slideList.map(
                        (item: any) =>
                            ({
                                id: item?.id ?? "",
                                adminKey: item?.admin_key ?? "",
                                type: item?.type ?? "",
                            } as IPresentationSlide)
                    );
                    changePresentationState({
                        ...presentationState,
                        slides: mappedSlideList,
                        voteKey: data?.voteKey ?? "",
                        pace: {
                            active: data?.pace?.active ?? "",
                            counter: data?.pace?.counter ?? 0,
                            mode: data?.pace?.mode ?? "",
                            state: data?.pace?.state ?? "",
                            groupId: data?.pace?.groupId ?? null,
                        } as IPresentationPace,
                    });
                    // if the slide has not been presented yet (user enters the URL directly into the URL bar)
                    if (data?.pace?.state === "idle") {
                        globalContext.unBlockUI();
                        alert.fireAlert();
                        return;
                    }
                    // get slide detail
                    const res = await PresentationService.getSlideDetailAsync(presentationId || "", slideId || "");
                    if (res.code === 200) {
                        // get slide result
                        const resultRes = await PresentationService.getSlideResultAsync(
                            presentationId || "",
                            slideId || ""
                        );
                        const resultResData = resultRes?.data;
                        if (resultRes.code === 200) {
                            const resData = res.data;
                            const newVal = { ...slideState };
                            newVal.question = resData?.question ?? "";
                            newVal.description = resData?.questionDescription ?? "";
                            newVal.type = resData?.type ?? "";
                            newVal.respondents = resultResData?.respondents ?? 0;
                            const processedResult = handleResultData(resData?.choices, resultResData?.results);
                            newVal.selectedOption = processedResult.selectedOption;
                            newVal.options = processedResult.options;
                            newVal.result = processedResult.results;
                            newVal.enableVoting = resData?.active ?? true;
                            newVal.showInstructionBar = !resData?.hideInstructionBar ?? true;
                            newVal.fontSize = resData?.textSize ?? 32;
                            newVal.id = resData?.id ?? "";
                            newVal.adminKey = resData?.adminKey ?? "";
                            newVal.presentationId = resData?.presentationId ?? "";
                            newVal.presentationSeriesId = resData?.presentationSeriesId ?? "";
                            newVal.position = resData?.position ?? "";
                            newVal.createdAt = resData?.createdAt ?? "";
                            newVal.config = null;
                            newVal.updatedAt = resData?.updatedAt ?? "";
                            newVal.questionImageUrl = resData?.questionImageUrl ?? "";
                            newVal.questionVideoUrl = resData?.questionVideoUrl ?? "";
                            changeSlideState(newVal);
                            globalContext.unBlockUI();
                            return;
                        }
                        Notification.notifyError(ERROR_NOTIFICATION.FETCH_SLIDE_RESULT);
                        globalContext.unBlockUI();
                        return;
                    }
                    //     if (res.code === RESPONSE_CODE.PRESENTATION_NOT_FOUND) {
                    //         alertNavigate.setTitle("Bài trình bày không tồn tại").setText("");
                    //         alertNavigate.getAlert().fireAlert();
                    //         globalContext.unBlockUI();
                    //         return;
                    //     }
                    //     if (res.code === RESPONSE_CODE.SLIDE_NOT_FOUND) {
                    //         alertNavigate.setTitle("Trang chiếu không tồn tại").setText("");
                    //         alertNavigate.getAlert().fireAlert();
                    //         globalContext.unBlockUI();
                    //         return;
                    //     }
                    //     if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
                    //         Notification.notifyError("Có lỗi xảy ra khi gửi yêu cầu");
                    //         globalContext.unBlockUI();
                    //         return;
                    //     }
                    //     Notification.notifyError("Có lỗi xảy ra khi lấy chi tiết trang chiếu");
                    //     globalContext.unBlockUI();
                    //     return;
                }
                // if (presentationRes.code === RESPONSE_CODE.VALIDATION_ERROR) {
                //     const errors = (presentationRes.errors as any[]) || null;
                //     if (errors) {
                //         const msg = errors[0]?.message;
                //         alertNavigate.setTitle(msg);
                //         alertNavigate.getAlert().fireAlert();
                //         globalContext.unBlockUI();
                //         return;
                //     }
                //     globalContext.unBlockUI();
                //     return;
                // }
                // if (presentationRes.code === RESPONSE_CODE.PRESENTATION_NOT_FOUND) {
                //     alertNavigate.setTitle("Bài trình bày không tồn tại").setText("");
                //     alertNavigate.getAlert().fireAlert();
                //     globalContext.unBlockUI();
                //     return;
                // }
                throw new Error("Unknown http code");
            } catch (err) {
                console.error(err);
                if (err === "forbidden") {
                    kickAlert.fireAlert();
                }
                globalContext.unBlockUI();
            }
        };
        fetchingPresentationDetail();
        // eslint-disable-next-line
    }, [slideId]);

    const handleTurnOffPresentationMode = async (callApi: boolean = true) => {
        try {
            if (callApi) await PresentationService.updatePresentationPaceAsync(presentationId ?? "", "", "quit");
            // if (
            // 	presentationState.permission.presentationRole === "owner" ||
            // 	presentationState.permission.presentationRole === "collaborator"
            // ) {
            // 	navigate(`/presentations/${presentationId}/${slideId}/edit`);
            // 	return;
            // }
            // if (
            // 	presentationState.permission.groupRole === "owner" ||
            // 	presentationState.permission.groupRole === "co-owner"
            // ) {
            // 	presentationState.pace.groupId !== null
            // 		? navigate(`/groups/group-list/${presentationState.pace.groupId}`)
            // 		: navigate("/");
            // 	return;
            // }
            navigate(`/presentation/${presentationId}/${slideId}/edit`);
        } catch (err) {
            console.error(err);
            Notification.notifyError(ERROR_NOTIFICATION.UPDATE_PRESENTATION_STATE);
        }
    };

    // find path for next and back slide button
    thisSlideIndex.current = presentationState.slides.findIndex((slide) => slide.adminKey === slideId);

    const changeSlide = async (next: boolean) => {
        // const targetSlideId = next
        // 	? presentationState.slides[thisSlideIndex.current + 1].adminKey
        // 	: presentationState.slides[thisSlideIndex.current - 1].adminKey;
        // try {
        // 	const updatePaceRes = await PresentationService.updatePresentationPaceAsync(
        // 		presentationId ?? "",
        // 		targetSlideId ?? "",
        // 		"change_slide",
        // 	);
        // 	if (updatePaceRes.code === RESPONSE_CODE.CHANGE_SLIDE_PERMISSION) {
        // 		new AlertBuilder()
        // 			.setTitle("Thông báo")
        // 			.setText("Bài trình chiếu này hiện đang không được trình chiếu.")
        // 			.setAlertType("info")
        // 			.setConfirmBtnText("OK")
        // 			.setOnConfirm(() => navigate("/"))
        // 			.preventDismiss()
        // 			.getAlert()
        // 			.fireAlert();
        // 		return;
        // 	}
        // } catch (updatePaceErr) {
        // 	Notification.notifyError("Có lỗi xảy ra khi cập nhật trạng thái trình chiếu");
        // 	console.error(updatePaceErr);
        // }
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
