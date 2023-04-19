import { faBars, faCheck, faChevronLeft, faList, faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, useEffect, useState } from "react";
import { Button, Dropdown, Spinner, Stack } from "react-bootstrap";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { ERROR_NOTIFICATION, RESPONSE_CODE, SUCCESS_NOTIFICATION } from "../../../constants";
import PresentationService from "../../../services/presentation-service";
import { Notification } from "../../components/notification";
import CustomizedTooltip from "../../components/tooltip";
import { useAuth } from "../../contexts/auth-context";
import { ErrorState, usePresentFeature } from "../../contexts/present-feature-context";
import { IBaseComponent } from "../../interfaces/basic-interfaces";
import PresentationInfo from "./presentation-info";
import "./style.scss";
import { AlertBuilder } from "../../components/alert";

interface IEditPresentationLayout extends IBaseComponent {
    sidebarElement: ReactElement;
}

const smallScreenMediaQuery = "(max-width: 768px)";

export default function EditPresentationLayout(props: IEditPresentationLayout) {
    const { sidebarElement } = props;
    // contexts
    const { userInfo, removeUserInfo } = useAuth();
    const { indicators, presentationState } = usePresentFeature();

    // states
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [hideHeaderRight, setHideHeaderRight] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia(smallScreenMediaQuery).matches);
    // const [showSelectGroupModal, setShowSelectGroupModal] = useState<boolean>(false);

    // libs
    const { presentationId, slideId } = useParams();
    const navigate = useNavigate();

    // add event to alert user to save before leaving
    useEffect(() => {
        const onCloseWindow = (e: BeforeUnloadEvent) => {
            e.preventDefault();

            return indicators.isModified && (e.returnValue = "Sure?");
        };

        window.addEventListener("beforeunload", onCloseWindow);
        return () => {
            window.removeEventListener("beforeunload", onCloseWindow);
        };
    }, [indicators.isModified]);

    useEffect(() => {
        const onChange = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
        const mediaQueryList = window.matchMedia(smallScreenMediaQuery);
        mediaQueryList.addEventListener("change", onChange);
        return () => {
            mediaQueryList.removeEventListener("change", onChange);
        };
    }, []);

    const handleLogout = () => {
        removeUserInfo();
    };

    const handlePresentSlide = async () => {
        try {
            await PresentationService.updatePresentationPaceAsync(presentationId || "", slideId ?? "", "present");

            navigate(`/presentation/${presentationId}/${slideId}`);
        } catch (error: any) {
            const res = error?.response?.data;

            if (res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION) {
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION);
                return;
            }

            if (res.code === RESPONSE_CODE.CANNOT_FIND_SLIDE) {
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_SLIDE);
                return;
            }

            if (res.code === RESPONSE_CODE.PRESENT_SLIDE_PERMISSION) {
                const handleRequestTurnOffPresenting = async () => {
                    try {
                        await PresentationService.updatePresentationPaceAsync(presentationId || "", null, "quit");

                        Notification.notifySuccess(SUCCESS_NOTIFICATION.QUIT_SLIDE_SUCCESS);
                    } catch (err: any) {
                        const res = err?.response?.data;

                        if (res.code === RESPONSE_CODE.QUIT_SLIDE_PERMISSION) {
                            Notification.notifySuccess(SUCCESS_NOTIFICATION.QUIT_SLIDE_SUCCESS);
                            return;
                        }

                        console.error(err);
                        Notification.notifyError(ERROR_NOTIFICATION.UPDATE_PRESENTATION_PACE_PROCESS);
                    }
                };

                new AlertBuilder()
                    .setTitle("Thông báo")
                    .setText(
                        "Bài trình bày này đang được trình chiếu, bạn muốn đi đến trang đang chiếu hay buộc tắt trang đang được chiếu?"
                    )
                    .setAlertType("info")
                    .setConfirmBtnText("Đến trang chiếu")
                    .setCancelBtnText("Buộc tắt")
                    .showCloseButton()
                    .preventDismiss()
                    .setOnConfirm(() =>
                        navigate(`/presentation/${presentationId}/${presentationState.pace.active_slide_id}`)
                    )
                    .setOnCancel(handleRequestTurnOffPresenting)
                    .getAlert()
                    .fireAlert();
                return;
            }

            console.error(error);
            Notification.notifyError(ERROR_NOTIFICATION.UPDATE_PRESENTATION_PACE_PROCESS);
            return;
        }
    };

    // rendering functions
    const renderIndicator = (): React.ReactNode => {
        if (indicators.isSaving) {
            return (
                <>
                    <div id="indicator" className="mx-2">
                        {!isSmallScreen && (
                            <span className="text-muted me-2" style={{ fontSize: "0.9rem" }}>
                                Đang lưu
                            </span>
                        )}
                        <Spinner animation="border" size="sm" variant="primary" />
                    </div>
                    <CustomizedTooltip
                        anchorSelect="#indicator"
                        content="Chỉnh sửa của bạn sẽ tự động được lưu"
                        place="bottom"
                    />
                </>
            );
        }

        if (!indicators.isModified) {
            return (
                <>
                    <div id="indicator" className="mx-2">
                        {!isSmallScreen && (
                            <span className="text-muted me-2" style={{ fontSize: "0.9rem" }}>
                                Đã lưu
                            </span>
                        )}
                        <FontAwesomeIcon className="text-success" icon={faCheck} size="lg" />
                    </div>
                    <CustomizedTooltip
                        anchorSelect="#indicator"
                        content="Chỉnh sửa của bạn sẽ tự động được lưu"
                        place="bottom"
                    />
                </>
            );
        }

        if (indicators.error !== ErrorState.none) {
            return (
                <>
                    <div id="indicator" className="mx-2">
                        {!isSmallScreen && (
                            <span className="text-danger me-2" style={{ fontSize: "0.9rem" }}>
                                Chưa lưu
                            </span>
                        )}
                        <FontAwesomeIcon className=" text-danger" icon={faXmark} size="lg" />
                    </div>
                    <CustomizedTooltip
                        anchorSelect="#indicator"
                        content="Chỉnh sửa của bạn sẽ tự động được lưu"
                        place="bottom"
                    />
                </>
            );
        }

        return (
            <>
                <div id="indicator" className="mx-2">
                    {!isSmallScreen && (
                        <span className="text-muted me-2" style={{ fontSize: "0.9rem" }}>
                            Đang lưu
                        </span>
                    )}
                    <Spinner animation="border" size="sm" variant="primary" />
                </div>
                <CustomizedTooltip
                    anchorSelect="#indicator"
                    content="Chỉnh sửa của bạn sẽ tự động được lưu"
                    place="bottom"
                />
            </>
        );
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
                        <div className="static-header__menu-btn-container--lg me-1">
                            <Link
                                to="/dashboard/presentation-list"
                                className="px-0 mx-1 h-100 d-flex align-items-center justify-content-center"
                                id="back-to-presentation"
                            >
                                <FontAwesomeIcon className="me-2" icon={faChevronLeft} size="lg" />
                            </Link>
                            <CustomizedTooltip
                                anchorSelect="#back-to-presentation"
                                content="Danh sách bài trình chiếu"
                                place="bottom"
                            />
                        </div>

                        <div className="static-header__menu-btn-container--sm me-1">
                            <Dropdown>
                                <Dropdown.Toggle className="static-header__menu-btn" variant="light">
                                    <FontAwesomeIcon className="text-primary" icon={faBars} size="lg" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{ margin: 0 }}>
                                    <Dropdown.Item
                                        className="d-flex align-items-center"
                                        onClick={() => setIsCollapsed(false)}
                                    >
                                        <FontAwesomeIcon
                                            style={{ width: "1rem", marginRight: "0.6rem" }}
                                            icon={faList}
                                        />
                                        Danh sách trang chiếu
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className="d-flex align-items-center"
                                        onClick={() => navigate("/dashboard/presentation-list")}
                                    >
                                        <FontAwesomeIcon
                                            style={{ width: "1rem", marginRight: "0.6rem" }}
                                            icon={faChevronLeft}
                                        />
                                        Danh sách bài trình bày
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Stack direction="horizontal" className="align-items-center">
                            <PresentationInfo
                                doesWhenEditModeOn={() => setHideHeaderRight(true)}
                                doesWhenEditModeOff={() => setHideHeaderRight(false)}
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
                            {!hideHeaderRight && renderIndicator()}

                            {!isSmallScreen && (
                                <Button className="mx-2" variant="primary" onClick={handlePresentSlide}>
                                    <FontAwesomeIcon icon={faPlay} size="lg" />
                                    <span className="ms-2">Trình chiếu</span>
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
                                (hideHeaderRight ? null : (
                                    <>
                                        <Button className="mx-2 px-3" variant="primary" onClick={handlePresentSlide}>
                                            <FontAwesomeIcon icon={faPlay} size="lg" />
                                        </Button>
                                        <Dropdown>
                                            <Dropdown.Toggle
                                                className="static-header__avatar-dropdown-btn px-2"
                                                variant="light"
                                            >
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
                                    </>
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
