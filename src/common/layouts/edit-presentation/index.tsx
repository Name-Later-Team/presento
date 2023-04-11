import { faBars, faCheck, faChevronLeft, faFloppyDisk, faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Stack } from "react-bootstrap";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { ERROR_NOTIFICATION, RESPONSE_CODE } from "../../../constants";
import PresentationService from "../../../services/presentation-service";
import { Notification } from "../../components/notification";
import CustomizedTooltip from "../../components/tooltip";
import { useAuth } from "../../contexts/auth-context";
import { useGlobalContext } from "../../contexts/global-context";
import { usePresentFeature } from "../../contexts/present-feature-context";
import { IBaseComponent } from "../../interfaces/basic-interfaces";
import PresentationInfo from "./presentation-info";
import "./style.scss";
import SlideService from "../../../services/slide-service";
import DataMappingUtil from "../../utils/data-mapping-util";
import moment from "moment";

interface IEditPresentationLayout extends IBaseComponent {
    sidebarElement: ReactElement;
}

const smallScreenMediaQuery = "(max-width: 768px)";

export default function EditPresentationLayout(props: IEditPresentationLayout) {
    const { sidebarElement } = props;
    // contexts
    const { userInfo, removeUserInfo } = useAuth();
    const { slideState, presentationState, isModified, resetSlideState, resetPresentationState, saveChanges } =
        usePresentFeature();
    const globalContext = useGlobalContext();

    // states
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [hideSaveBtn, setHideSaveBtn] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia(smallScreenMediaQuery).matches);
    // const [showSelectGroupModal, setShowSelectGroupModal] = useState<boolean>(false);

    // refs
    const gotSlideDetail = useRef(false);

    // libs
    const { presentationId, slideId } = useParams();
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

    useEffect(() => {
        const onChange = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
        const mediaQueryList = window.matchMedia(smallScreenMediaQuery);
        mediaQueryList.addEventListener("change", onChange);
        return () => {
            mediaQueryList.removeEventListener("change", onChange);
        };
    }, []);

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
    }, [presentationId, slideId]);

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
        saveChanges();
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

                            {/* if the screen is big enough */}
                            {!isSmallScreen &&
                                (hideSaveBtn ? null : isModified ? (
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
                                ))}

                            {!isSmallScreen &&
                                (hideSaveBtn ? null : (
                                    <Button
                                        className="mx-2"
                                        variant="secondary"
                                        disabled={!isModified}
                                        onClick={handleSaveSlide}
                                    >
                                        <FontAwesomeIcon className="me-1" icon={faFloppyDisk} size="lg" /> Lưu
                                    </Button>
                                ))}

                            {!isSmallScreen && (
                                <Button className="mx-2" variant="primary" onClick={handlePresentSlide}>
                                    <FontAwesomeIcon className="me-1" icon={faPlay} size="lg" /> Trình chiếu
                                </Button>
                            )}

                            {!isSmallScreen && (
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
                                        <Dropdown.Item onClick={() => navigate("/profile")}>
                                            Hồ sơ cá nhân
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}

                            {/* if the screen is small */}
                            {isSmallScreen &&
                                (hideSaveBtn ? null : (
                                    <Dropdown>
                                        <Dropdown.Toggle className="text-primary" variant="light">
                                            Hành động
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu style={{ margin: 0 }}>
                                            <Dropdown.Item disabled={!isModified} onClick={handleSaveSlide}>
                                                <FontAwesomeIcon
                                                    style={{ width: "1rem" }}
                                                    className="me-2"
                                                    icon={faFloppyDisk}
                                                    size="lg"
                                                />{" "}
                                                Lưu
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={handlePresentSlide}>
                                                <FontAwesomeIcon
                                                    style={{ width: "1rem" }}
                                                    className="me-2"
                                                    icon={faPlay}
                                                    size="lg"
                                                />{" "}
                                                Trình chiếu
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                ))}

                            {isSmallScreen &&
                                (hideSaveBtn ? null : (
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
                                            <Dropdown.Item onClick={() => navigate("/profile")}>
                                                Hồ sơ cá nhân
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                ))}
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
