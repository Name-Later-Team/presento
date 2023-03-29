import { faBars, faCheck, faChevronLeft, faFloppyDisk, faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useEffect, useState } from "react";
import { Button, Dropdown, Stack } from "react-bootstrap";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { ERROR_NOTIFICATION } from "../../../constants";
import PresentationService from "../../../services/presentation-service";
import { Notification } from "../../components/notification";
import CustomizedTooltip from "../../components/tooltip";
import { useAuth } from "../../contexts/auth-context";
import { useGlobalContext } from "../../contexts/global-context";
import { usePresentFeature } from "../../contexts/present-feature-context";
import { IBaseComponent } from "../../interfaces/basic-interfaces";
import PresentationInfo from "./presentation-info";
import "./style.scss";

interface IEditPresentationLayout extends IBaseComponent {
    sidebarElement: ReactElement;
}

export default function EditPresentationLayout(props: IEditPresentationLayout) {
    const { sidebarElement } = props;
    const { userInfo, removeUserInfo } = useAuth();
    const { slideState, isModified, resetSlideState } = usePresentFeature();
    const globalContext = useGlobalContext();

    const { presentationId, slideId } = useParams();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [hideSaveBtn, setHideSaveBtn] = useState(false);
    // const [showSelectGroupModal, setShowSelectGroupModal] = useState<boolean>(false);
    const navigate = useNavigate();

    // add event to alert user to save before leaving
    useEffect(() => {
        const onCloseWindow = (e: BeforeUnloadEvent) => {
            e.preventDefault();

            return isModified && (e.returnValue = "Sure?");
        };

        window.addEventListener("beforeunload", onCloseWindow);
        return () => {
            window.removeEventListener("beforeunload", onCloseWindow);
        };
    }, [isModified]);

    // effect that happens when change slide within the edit page
    useEffect(() => {
        const fetchingSlideDetail = async () => {
            globalContext.blockUI("Đang lấy thông tin");
            try {
                const res = await PresentationService.getSlideDetailAsync(presentationId || "", slideId || "");
                if (res.code === 200) {
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
                        const choices = resData?.choices;
                        const options: { key: string; value: string }[] = [];
                        const results: { key: string; value: number }[] = [];
                        if (Array.isArray(choices)) {
                            const flag = Array.isArray(resultResData?.results);
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
                                        (resultResData?.results as any[]).find((element) => element?.id === item?.id)
                                            ?.score[0] ?? 0;
                                }
                                results.push(tempResult);
                                if (item?.correctAnswer === true) {
                                    haveCorrectAnswer = true;
                                    newVal.selectedOption = item?.id;
                                }
                            });
                            if (!haveCorrectAnswer) newVal.selectedOption = "";
                            newVal.options = options;
                            newVal.result = results;
                        }
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
                        resetSlideState(newVal);
                        globalContext.unBlockUI();
                        return;
                    }
                    Notification.notifyError(ERROR_NOTIFICATION.FETCH_SLIDE_RESULT);
                    globalContext.unBlockUI();
                    return;
                }
                // if (res.code === RESPONSE_CODE.PRESENTATION_NOT_FOUND) {
                // 	Notification.notifyError("Không tìm thấy bài trình chiếu");
                // 	globalContext.unBlockUI();
                // 	return;
                // }
                // if (res.code === RESPONSE_CODE.SLIDE_NOT_FOUND) {
                // 	Notification.notifyError("Không tìm thấy trang chiếu");
                // 	globalContext.unBlockUI();
                // 	return;
                // }
                // if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
                // 	Notification.notifyError("Có lỗi xảy ra khi gửi yêu cầu");
                // 	globalContext.unBlockUI();
                // 	return;
                // }
                throw new Error("Unknown http code");
            } catch (err) {
                console.error(err);
                globalContext.unBlockUI();
            }
        };
        fetchingSlideDetail();
        // eslint-disable-next-line
    }, [presentationId, slideId]);

    const handleLogout = () => {
        removeUserInfo();
    };

    const handleSaveSlide = async () => {
        // try {
        // 	globalContext.blockUI();
        // 	// prepare request values
        // 	const reqData: ISlideDetailResponse = {
        // 		id: slideState.id,
        // 		adminKey: slideState.adminKey,
        // 		active: slideState.enableVoting,
        // 		hideInstructionBar: !slideState.showInstructionBar,
        // 		choices: [],
        // 		config: slideState.config ?? {},
        // 		createdAt: slideState.createdAt,
        // 		updatedAt: slideState.updatedAt,
        // 		position: slideState.position,
        // 		presentationId: slideState.presentationId,
        // 		presentationSeriesId: slideState.presentationSeriesId,
        // 		question: slideState.question,
        // 		questionDescription: slideState.description,
        // 		questionImageUrl: slideState.questionImageUrl === "" ? null : slideState.questionImageUrl,
        // 		questionVideoUrl: slideState.questionVideoUrl === "" ? null : slideState.questionVideoUrl,
        // 		speakerNotes: slideState.speakerNotes,
        // 		textSize: slideState.fontSize,
        // 		type: slideState.type,
        // 	};
        // 	// map state into req data
        // 	slideState.options.forEach((option, idx) => {
        // 		reqData.choices.push({
        // 			id: option.key,
        // 			label: option.value,
        // 			position: idx,
        // 			correctAnswer: option.key === slideState.selectedOption,
        // 		});
        // 	});
        // 	// call update slide api
        // 	const res = await HttpService.put<any>(`/v1/presentations/${presentationId}/slides/${slideId}`, reqData);
        // 	if (res.code === 200) {
        // 		Notification.notifySuccess("Lưu thay đổi thành công");
        // 		// update slide list icon locally insteads of get new info from api
        // 		changePresentationState({
        // 			...presentationState,
        // 			slides: presentationState.slides.map((slide) => {
        // 				if (slide.adminKey === slideId) {
        // 					return {
        // 						...slide,
        // 						type: slideState.type || "",
        // 					};
        // 				}
        // 				return { ...slide };
        // 			}),
        // 		});
        // 		globalContext.unBlockUI();
        // 		return;
        // 	}
        // 	if (res.code === RESPONSE_CODE.PRESENTATION_NOT_FOUND) {
        // 		Notification.notifyError("Lưu thất bại do không tìm thấy bài trình chiếu");
        // 		globalContext.unBlockUI();
        // 		return;
        // 	}
        // 	if (res.code === RESPONSE_CODE.SLIDE_NOT_FOUND) {
        // 		Notification.notifyError("Lưu thất bại do không tìm thấy trang chiếu");
        // 		globalContext.unBlockUI();
        // 		return;
        // 	}
        // 	if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
        // 		Notification.notifyError("Có lỗi xảy ra khi gửi yêu cầu");
        // 		globalContext.unBlockUI();
        // 		return;
        // 	}
        // 	if (res.code === RESPONSE_CODE.PRESENTING_PRESENTATION) {
        // 		const handleRequestTurnOffPresenting = async () => {
        // 			globalContext.blockUI(undefined, true);
        // 			try {
        // 				await PresentationService.updatePresentationPaceAsync(
        // 					presentationId ?? "",
        // 					slideId ?? "",
        // 					"quit",
        // 				);
        // 				Notification.notifySuccess("Tắt trang đang chiếu thành công");
        // 			} catch (err) {
        // 				console.error(err);
        // 				Notification.notifyError(
        // 					"Có lỗi xảy ra khi cập nhật trạng thái trình chiếu, vui lòng thử lại sau",
        // 				);
        // 			}
        // 			globalContext.unBlockUI();
        // 		};
        // 		if (presentationState.permission.presentationRole === "owner") {
        // 			new AlertBuilder()
        // 				.setTitle("Thông báo")
        // 				.setText(
        // 					"Bài này đang được trình chiếu, bạn có muốn đi đến trang đang chiếu hoặc buộc tắt trang đang được chiếu không?",
        // 				)
        // 				.setAlertType("info")
        // 				.setConfirmBtnText("Đến trang chiếu")
        // 				.setCancelBtnText("Tắt trang chiếu")
        // 				.showCloseButton()
        // 				.preventDismiss()
        // 				.setOnConfirm(() =>
        // 					navigate(`/presentations/${presentationId}/${presentationState.pace.active}`),
        // 				)
        // 				.setOnCancel(handleRequestTurnOffPresenting)
        // 				.getAlert()
        // 				.fireAlert();
        // 		} else {
        // 			new AlertBuilder()
        // 				.setTitle("Thông báo")
        // 				.setText("Bài này đang được trình chiếu, bạn không được phép thao tác chỉnh sửa trang chiếu")
        // 				.setAlertType("info")
        // 				.setConfirmBtnText("Đã hiểu")
        // 				.showCloseButton()
        // 				.getAlert()
        // 				.fireAlert();
        // 		}
        // 		globalContext.unBlockUI();
        // 		return;
        // 	}
        // 	throw new Error("Unknown http code");
        // } catch (error) {
        // 	console.error(error);
        // 	globalContext.unBlockUI();
        // }
    };

    const handlePresentSlide = async () => {
        try {
            globalContext.blockUI(undefined, true);
            await PresentationService.updatePresentationPaceAsync(presentationId ?? "", slideId ?? "", "present", {
                scope: "public",
                groupId: null,
            });
            // if (
            // 	res.code === RESPONSE_CODE.MY_PRESENTATION_IN_GROUP ||
            // 	res.code === RESPONSE_CODE.PRESENTING_SLIDE_PERMISSION
            // ) {
            // 	const handleRequestTurnOffPresenting = async () => {
            // 		globalContext.blockUI(undefined, true);
            // 		try {
            // 			await PresentationService.updatePresentationPaceAsync(
            // 				presentationId ?? "",
            // 				slideId ?? "",
            // 				"quit",
            // 			);
            // 			Notification.notifySuccess("Tắt trang đang chiếu thành công");
            // 		} catch (err) {
            // 			console.error(err);
            // 			Notification.notifyError(
            // 				"Có lỗi xảy ra khi cập nhật trạng thái trình chiếu, vui lòng thử lại sau",
            // 			);
            // 		}
            // 		globalContext.unBlockUI();
            // 	};
            // 	new AlertBuilder()
            // 		.setTitle("Thông báo")
            // 		.setText(
            // 			"Bài này đang được trình chiếu, bạn có muốn đi đến trang đang chiếu hoặc buộc tắt trang đang được chiếu không?",
            // 		)
            // 		.setAlertType("info")
            // 		.setConfirmBtnText("Đến trang chiếu")
            // 		.setCancelBtnText("Tắt trang chiếu")
            // 		.showCloseButton()
            // 		.preventDismiss()
            // 		.setOnConfirm(() => navigate(`/presentations/${presentationId}/${presentationState.pace.active}`))
            // 		.setOnCancel(handleRequestTurnOffPresenting)
            // 		.getAlert()
            // 		.fireAlert();
            // 	globalContext.unBlockUI();
            // 	return;
            // }
            // if (res.code === RESPONSE_CODE.OTHER_PRESENTATION_IN_GROUP) {
            // 	new AlertBuilder()
            // 		.setTitle("Thông báo")
            // 		.setText("Bạn không được phép trình chiếu do nhóm này đang có người khác đang trình chiếu")
            // 		.setAlertType("info")
            // 		.setConfirmBtnText("Đã hiểu")
            // 		.showCloseButton()
            // 		.getAlert()
            // 		.fireAlert();
            // 	globalContext.unBlockUI();
            // 	return;
            // }
            globalContext.unBlockUI();
            navigate(`/presentation/${presentationId}/${slideId}`);
        } catch (updatePaceErr) {
            console.error(updatePaceErr);
            Notification.notifyError(ERROR_NOTIFICATION.PRESENT_FAILED);
            globalContext.unBlockUI();
            return;
        }
    };

    return (
        <>
            <div className="edit-presentation-layout">
                <div
                    className={`edit-presentation-layout__backdrop${
                        isCollapsed ? " edit-presentation-layout__backdrop--collapsed" : ""
                    }`}
                    onClick={() => !isCollapsed && setIsCollapsed(true)}
                >
                    <aside className="edit-presentation-layout__sidebar-container" onClick={(e) => e.stopPropagation()}>
                        <Button
                            className={`sidebar-container__close-btn${
                                isCollapsed ? " sidebar-container__close-btn--collapsed" : ""
                            }`}
                            variant="light"
                            onClick={() => setIsCollapsed(true)}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} size="lg" />

                            <span className="ms-3">Đóng</span>
                        </Button>
                        {sidebarElement}
                    </aside>
                </div>
                <div className="edit-presentation-layout__main-content">
                    <div className="main-content__static-header">
                        <Button
                            className="static-header__menu-btn"
                            variant="light"
                            onClick={() => setIsCollapsed(false)}
                        >
                            <FontAwesomeIcon className="text-primary" icon={faBars} size="lg" />
                        </Button>
                        <Stack direction="horizontal" className="align-items-center">
                            <Link
                                to="/dashboard/presentation-list"
                                className="px-0 mx-2 h-100 d-flex align-items-center justify-content-center"
                                id="back-to-presentation"
                            >
                                <FontAwesomeIcon className="me-2" icon={faChevronLeft} size="lg" />
                            </Link>
                            <CustomizedTooltip
                                anchorSelect="#back-to-presentation"
                                content="Danh sách bài trình chiếu"
                                place="bottom"
                            />

                            <PresentationInfo
                                doesWhenEditModeOn={() => setHideSaveBtn(true)}
                                doesWhenEditModeOff={() => setHideSaveBtn(false)}
                            />
                        </Stack>

                        <div className="static-header__header-actions">
                            {/* <Button
                                className="mx-2"
                                variant="outline-primary"
                                onClick={() => window.open(`/presentations/${presentationId}/result`, "_blank")}
                            >
                                <FontAwesomeIcon className="me-1" icon={faSquarePollVertical} size="lg" /> Xem kết quả
                            </Button> */}

                            {hideSaveBtn ? null : isModified ? (
                                <div className="mx-2">
                                    <span className="text-danger me-2" style={{ fontSize: "0.9rem" }}>
                                        Chưa lưu
                                    </span>
                                    <FontAwesomeIcon className=" text-danger" icon={faXmark} size="lg" />
                                </div>
                            ) : (
                                <div className="mx-2">
                                    <span className="text-muted me-2" style={{ fontSize: "0.9rem" }}>
                                        Đã lưu
                                    </span>
                                    <FontAwesomeIcon className="text-success" icon={faCheck} size="lg" />
                                </div>
                            )}

                            {hideSaveBtn ? null : (
                                <Button
                                    className="mx-2"
                                    variant="secondary"
                                    disabled={!isModified}
                                    onClick={handleSaveSlide}
                                >
                                    <FontAwesomeIcon className="me-1" icon={faFloppyDisk} size="lg" /> Lưu
                                </Button>
                            )}

                            <Button className="mx-2" variant="primary" onClick={handlePresentSlide}>
                                <FontAwesomeIcon className="me-1" icon={faPlay} size="lg" /> Trình chiếu
                            </Button>

                            <Dropdown>
                                <Dropdown.Toggle className="static-header__avatar-dropdown-btn" variant="light">
                                    <img
                                        className="static-header__avatar"
                                        src={`${userInfo?.avatar || "/images/default-avatar.png"}`}
                                        alt="profile-avatar"
                                        loading="lazy"
                                    />
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{ margin: 0 }}>
                                    <Dropdown.Item onClick={() => navigate("/profile")}>Hồ sơ cá nhân</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="main-content__dynamic-content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}
