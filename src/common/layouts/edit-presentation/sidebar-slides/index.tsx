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
import { ICreateNewSlideResponse } from "../../../interfaces";

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

    // slide id to scroll into view
    const [scrollToSlideId, setScrollToSlideId] = useState<string | undefined>(undefined);

    // contexts
    const { presentationState, changePresentationState, resetPresentationState } = usePresentFeature();
    const globalContext = useGlobalContext();

    // Append the new slide data into the slides list and navigate to the newly created slide
    const handleCreateNewSlideResponse = (data: ICreateNewSlideResponse) => {
        resetPresentationState({
            slides: [...presentationState.slides, DataMappingUtil.mapNewlyCreatedSlideData(data)],
            totalSlides: presentationState.totalSlides + 1,
        });
        navigate(`/presentation/${presentationId}/${data.id}/edit`);
        setScrollToSlideId(data.id.toString());
    };

    // Omit the deleted slide in the slides list and navigate if needed
    const handleDeleteSlideResponse = (deletedSlideId: string) => {
        // navigate to the previous slide if the deleted slide is the currently viewing slide
        if (deletedSlideId.toString() === slideId?.toString()) {
            const previousSlideIndex =
                presentationState.slides.findIndex((item) => item.id.toString() === deletedSlideId.toString()) - 1;
            previousSlideIndex > -1 &&
                navigate(`/presentation/${presentationId}/${presentationState.slides[previousSlideIndex].id}/edit`);
        }

        // shift position and get rid of the deleted slide in state
        const newSlidesList: IPresentationSlide[] = [];
        presentationState.slides.forEach((item) => {
            if (item.id > deletedSlideId) {
                newSlidesList.push({
                    ...item,
                    position: item.position - 1,
                });
            }
            if (item.id < deletedSlideId) {
                newSlidesList.push({
                    ...item,
                });
            }
        });
        resetPresentationState({
            slides: newSlidesList,
            totalSlides: presentationState.totalSlides - 1,
        });
    };

    const getPresentationDetail = async () => {
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
                setScrollToSlideId(slideId);
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
                // getPresentationDetail(true);
                if (!res.data) return;
                handleCreateNewSlideResponse(res.data);
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
    const handleDeleteSlide = async (slideId: string) => {
        if (presentationState.slides.length <= 1) {
            new AlertBuilder()
                .setTitle("Cảnh báo")
                .setAlertType("warning")
                .setConfirmBtnText("OK")
                .setText("Bạn không thể xóa trang chiếu cuối cùng của 1 bài trình bày")
                .getAlert()
                .fireAlert();
            return;
        }
        try {
            globalContext.blockUI();
            const res = await SlideService.deleteSlideAsync(presentationId || "", slideId || "");
            if (res.code === 200) {
                globalContext.unBlockUI();
                Notification.notifySuccess(SUCCESS_NOTIFICATION.DELETE_SLIDE_SUCCESS);
                handleDeleteSlideResponse(slideId);
                return;
            }

            throw new Error("Unhandled http code");
        } catch (error: any) {
            const res = error?.response?.data;

            if (res.code === RESPONSE_CODE.DELETE_ONLY_SLIDE) {
                globalContext.unBlockUI();
                Notification.notifyError(ERROR_NOTIFICATION.DELETE_ONLY_SLIDE);
                return;
            }

            if (res.code === RESPONSE_CODE.CANNOT_FIND_SLIDE) {
                globalContext.unBlockUI();
                Notification.notifyError(ERROR_NOTIFICATION.CANNOT_FIND_SLIDE);
                return;
            }

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
