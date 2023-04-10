import { faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Nav } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Notification } from "../../../components/notification";
import { IPresentationSlide, usePresentFeature } from "../../../contexts/present-feature-context";
import { useGlobalContext } from "../../../contexts/global-context";
import CustomSlideNav from "./custom-slide-nav";
import { AlertBuilder } from "../../../components/alert";
import { ERROR_NOTIFICATION, RESPONSE_CODE, SUCCESS_NOTIFICATION } from "../../../../constants";
import {
    PREFETCHING_REDIRECT_CODE,
    SLIDE_TYPE,
} from "../../../../features/presentation-detail/components/presentation-fetching";
import PresentationService from "../../../../services/presentation-service";
import SlideService from "../../../../services/slide-service";
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd";
import "./style.scss";
import DataMappingUtil from "../../../utils/data-mapping-util";

export interface ISidebarSlideNav {
    slideId: string;
    icon: IconDefinition;
    typeLabel: string;
    path: string;
    position: number;
}

export default function SidebarSlides() {
    const location = useLocation();
    const navigate = useNavigate();
    const { presentationId, slideId } = useParams();

    const [scrollToSlideId, setScrollToSlideId] = useState<string | undefined>(undefined);

    const { presentationState, changePresentationState, resetPresentationState } = usePresentFeature();
    const globalContext = useGlobalContext();

    const getPresentationDetail = async (navigateToLastItem: boolean = false) => {
        if (presentationId == null) {
            return;
        }
        try {
            // get slide list and presentation config
            globalContext.blockUI();
            const res = await PresentationService.getPresentationDetailAsync(presentationId);

            if (res.code === 200) {
                const data = res.data as any;
                const mappedPresentationState = DataMappingUtil.mapPresentationStateFromApiData(
                    presentationState,
                    data
                );
                resetPresentationState(mappedPresentationState);
                globalContext.unBlockUI();
                // if last is true, navigate to the last item in slide list (used when creating a new slide), otherwise navigating according to pace field from api
                let scrollTo = slideId;
                if (navigateToLastItem) {
                    const navigateToSlideId = mappedPresentationState.slides.at(-1)?.id;
                    navigate(`/presentation/${presentationId}/${navigateToSlideId}/edit`);
                    scrollTo = navigateToSlideId;
                }

                setScrollToSlideId(scrollTo);
                return;
            }

            throw new Error("Unhandle http code");
        } catch (error: any) {
            const res = error?.response?.data;
            if (res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION || res.code === RESPONSE_CODE.VALIDATION_ERROR) {
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION);
                globalContext.unBlockUI();
                return;
            }

            console.error(error);
            Notification.notifyError(ERROR_NOTIFICATION.FETCH_PRESENTATION_DETAIL);
            globalContext.unBlockUI();
        }
    };

    useEffect(() => {
        if (location.state !== null && location.state !== undefined && presentationState.slides.length !== 0) {
            if ((location.state as any)?.code === PREFETCHING_REDIRECT_CODE) {
                setScrollToSlideId(slideId);
                return;
            }
        }

        // if user enter url directly into the url bar, fetch slide list and presentation config directly
        getPresentationDetail();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!scrollToSlideId) return;
        try {
            document.getElementById(`${scrollToSlideId}`)?.scrollIntoView({ block: "center" } as ScrollIntoViewOptions);
            setScrollToSlideId(undefined);
        } catch (err) {
            console.error(err);
        }
    }, [scrollToSlideId]);

    // create new slide
    const handleAddNewSlide = async () => {
        try {
            globalContext.blockUI();
            const res = await SlideService.createSlideAsync(presentationId || "", { type: "multiple_choice" });
            if (res.code === 201) {
                Notification.notifySuccess(SUCCESS_NOTIFICATION.ADD_SLIDE_SUCCESS);
                getPresentationDetail(true);
                return;
            }

            throw new Error("Unhandle http code");
        } catch (error: any) {
            const res = error?.response?.data;
            if (res.code === RESPONSE_CODE.VALIDATION_ERROR || res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION) {
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION);
                globalContext.unBlockUI();
                return;
            }

            if (res.code === RESPONSE_CODE.PRESENTING_PRESENTATION) {
                // manually turn off the presenting presentation
                // const handleRequestTurnOffPresenting = async () => {
                //     globalContext.blockUI(undefined, true);
                //     try {
                //         await PresentationService.updatePresentationPaceAsync(presentationId ?? "", "", "quit");
                //         Notification.notifySuccess("Tắt trang đang chiếu thành công");
                //     } catch (err) {
                //         console.error(err);
                //         Notification.notifyError(
                //             "Có lỗi xảy ra khi cập nhật trạng thái trình chiếu, vui lòng thử lại sau"
                //         );
                //     }
                //     globalContext.unBlockUI();
                // };
                // if (presentationState.permission.presentationRole === "owner") {
                //     new AlertBuilder()
                //         .setTitle("Thông báo")
                //         .setText(
                //             "Bài này đang được trình chiếu, bạn có muốn đi đến trang đang chiếu hoặc buộc tắt trang đang được chiếu không?"
                //         )
                //         .setAlertType("info")
                //         .setConfirmBtnText("Đến trang chiếu")
                //         .setCancelBtnText("Tắt trang chiếu")
                //         .showCloseButton()
                //         .preventDismiss()
                //         .setOnConfirm(() =>
                //             navigate(`/presentations/${presentationId}/${presentationState.pace.active}`)
                //         )
                //         .setOnCancel(handleRequestTurnOffPresenting)
                //         .getAlert()
                //         .fireAlert();
                // } else {
                //     new AlertBuilder()
                //         .setTitle("Thông báo")
                //         .setText("Bài này đang được trình chiếu, bạn không được phép thao tác chỉnh sửa trang chiếu")
                //         .setAlertType("info")
                //         .setConfirmBtnText("Đã hiểu")
                //         .showCloseButton()
                //         .getAlert()
                //         .fireAlert();
                // }
                Notification.notifyError(ERROR_NOTIFICATION.PRESENTING_PRESENTATION);
                globalContext.unBlockUI();
                return;
            }

            Notification.notifyError(ERROR_NOTIFICATION.CREATE_NEW_SLIDE);
            console.error(error);
            globalContext.unBlockUI();
        }
    };

    // delete a slide
    const handleDeleteSlide = async (adminKey: string) => {
        if (presentationState.slides.length <= 1) {
            new AlertBuilder()
                .setTitle("Cảnh báo")
                .setAlertType("warning")
                .setConfirmBtnText("OK")
                .setText("Bạn không thể xóa trang chiếu cuối cùng của 1 bài trình chiếu")
                .getAlert()
                .fireAlert();
            return;
        }
        try {
            globalContext.blockUI();
            const res = await SlideService.deleteSlideAsync(presentationId || "", adminKey || "");
            if (res.code === 200) {
                globalContext.unBlockUI();
                Notification.notifySuccess(SUCCESS_NOTIFICATION.DELETE_SLIDE_SUCCESS);
                getPresentationDetail();
                return;
            }
            // if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
            //     const errors = (res.errors as any[]) || null;
            //     if (errors) {
            //         const msg = errors[0]?.message;
            //         Notification.notifyError(msg);
            //         globalContext.unBlockUI();
            //         return;
            //     }
            //     globalContext.unBlockUI();
            //     return;
            // }
            // if (res.code === RESPONSE_CODE.PRESENTATION_NOT_FOUND) {
            //     Notification.notifyError("Bài trình bày không tồn tại");
            //     globalContext.unBlockUI();
            //     return;
            // }
            // if (res.code === RESPONSE_CODE.SLIDE_NOT_FOUND) {
            //     Notification.notifyError("Trang chiếu không tồn tại");
            //     globalContext.unBlockUI();
            //     return;
            // }
            // if (res.code === RESPONSE_CODE.PRESENTING_PRESENTATION) {
            //     const handleRequestTurnOffPresenting = async () => {
            //         globalContext.blockUI(undefined, true);
            //         try {
            //             await PresentationService.updatePresentationPaceAsync(presentationId ?? "", "", "quit");
            //             Notification.notifySuccess("Tắt trang đang chiếu thành công");
            //         } catch (err) {
            //             console.error(err);
            //             Notification.notifyError(
            //                 "Có lỗi xảy ra khi cập nhật trạng thái trình chiếu, vui lòng thử lại sau"
            //             );
            //         }
            //         globalContext.unBlockUI();
            //     };
            //     if (presentationState.permission.presentationRole === "owner") {
            //         new AlertBuilder()
            //             .setTitle("Thông báo")
            //             .setText(
            //                 "Bài này đang được trình chiếu, bạn có muốn đi đến trang đang chiếu hoặc buộc tắt trang đang được chiếu không?"
            //             )
            //             .setAlertType("info")
            //             .setConfirmBtnText("Đến trang chiếu")
            //             .setCancelBtnText("Tắt trang chiếu")
            //             .showCloseButton()
            //             .preventDismiss()
            //             .setOnConfirm(() =>
            //                 navigate(`/presentations/${presentationId}/${presentationState.pace.active}`)
            //             )
            //             .setOnCancel(handleRequestTurnOffPresenting)
            //             .getAlert()
            //             .fireAlert();
            //     } else {
            //         new AlertBuilder()
            //             .setTitle("Thông báo")
            //             .setText("Bài này đang được trình chiếu, bạn không được phép thao tác chỉnh sửa trang chiếu")
            //             .setAlertType("info")
            //             .setConfirmBtnText("Đã hiểu")
            //             .showCloseButton()
            //             .getAlert()
            //             .fireAlert();
            //     }
            //     globalContext.unBlockUI();
            //     return;
            // }
            throw new Error("Unhandled http code");
        } catch (error) {
            console.error(error);
            globalContext.unBlockUI();
        }
    };

    const dragEnd: OnDragEndResponder = (result) => {
        const { source, destination } = result;
        if (!destination || source.index === destination.index) return;

        const modifiedSlideData: IPresentationSlide[] = [];
        const sourceItem = presentationState.slides.find((item) => item.position === source.index);
        if (!sourceItem) return;

        // move item according to the animation
        if (destination.index > source.index) {
            presentationState.slides.forEach((item) => {
                // keep old position
                if (
                    item.position < source.index ||
                    (item.position > source.index && item.position > destination.index)
                ) {
                    modifiedSlideData.push(item);
                }
                // swap position
                if (item.position === destination.index) {
                    modifiedSlideData.push({
                        ...sourceItem,
                        position: destination.index,
                    });
                }
                // shift item by 1 position
                if (item.position > source.index && item.position <= destination.index) {
                    modifiedSlideData.push({
                        ...item,
                        position: item.position - 1,
                    });
                }
            });
        } else {
            presentationState.slides.forEach((item) => {
                // keep old position
                if (
                    item.position > source.index ||
                    (item.position < source.index && item.position < destination.index)
                ) {
                    modifiedSlideData.push(item);
                }
                // swap position
                if (item.position === destination.index) {
                    modifiedSlideData.push({
                        ...sourceItem,
                        position: destination.index,
                    });
                }
                // shift item by 1 position
                if (item.position < source.index && item.position >= destination.index) {
                    modifiedSlideData.push({
                        ...item,
                        position: item.position + 1,
                    });
                }
            });
        }

        changePresentationState({
            slides: modifiedSlideData,
        });
    };

    const slideNavs: ISidebarSlideNav[] = presentationState.slides.map((item) => ({
        slideId: item.id,
        icon: SLIDE_TYPE[item.type].icon,
        typeLabel: SLIDE_TYPE[item.type].label,
        path: `/presentation/${presentationId}/${item.id}/edit`,
        position: item.position,
    }));

    const mappedSlideData = [...slideNavs].sort((front, end) => front.position - end.position);

    return (
        <DragDropContext onDragEnd={dragEnd}>
            <Droppable droppableId="slide-list-dropzone">
                {(provided) => (
                    <Nav
                        ref={provided.innerRef}
                        className="sidebar-slides__container flex-column"
                        variant="pills"
                        activeKey={location.pathname}
                        {...provided.droppableProps}
                    >
                        <div className="sidebar-slides__add-new-slide">
                            <Button variant="primary" className="w-100" onClick={handleAddNewSlide}>
                                <FontAwesomeIcon className="me-2" icon={faPlus} /> Trang chiếu mới
                            </Button>
                            <hr />
                        </div>
                        {mappedSlideData &&
                            mappedSlideData.map((nav, index) => (
                                <Draggable draggableId={nav.path} key={nav.path} index={nav.position}>
                                    {(provided) => (
                                        <CustomSlideNav
                                            slideNum={index + 1}
                                            actions={{ onDelete: handleDeleteSlide }}
                                            {...nav}
                                            draggableProvided={provided}
                                            ref={provided.innerRef}
                                        />
                                    )}
                                </Draggable>
                            ))}
                        {provided.placeholder}
                    </Nav>
                )}
            </Droppable>
        </DragDropContext>
    );
}
