import { faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Nav } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Notification } from "../../../components/notification";
import { IPresentationPace, IPresentationSlide, usePresentFeature } from "../../../contexts/present-feature-context";
import { useGlobalContext } from "../../../contexts/global-context";
import CustomSlideNav from "./custom-slide-nav";
import { AlertBuilder } from "../../../components/alert";
import { SUCCESS_NOTIFICATION } from "../../../../constants";
import {
    PREFETCHING_REDIRECT_CODE,
    SLIDE_TYPE,
} from "../../../../features/presentation-detail/components/presentation-fetching";
import PresentationService from "../../../../services/presentation-service";
import SlideService from "../../../../services/slide-service";

export interface ISidebarSlideNav {
    slideId: string;
    icon: IconDefinition;
    path: string;
}

export default function SidebarSlides() {
    const location = useLocation();
    const navigate = useNavigate();
    const { presentationId } = useParams();
    const { presentationState, changePresentationState } = usePresentFeature();
    const globalContext = useGlobalContext();
    const [slideData, setSlideData] = useState<ISidebarSlideNav[]>([]);

    const updateSlideList = () => {
        const slideNavs: ISidebarSlideNav[] = presentationState.slides.map((item) => ({
            slideId: item.adminKey,
            icon: SLIDE_TYPE[item.type],
            path: `/presentation/${presentationId}/${item.adminKey}/edit`,
        }));
        setSlideData(slideNavs);
    };

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
                const slideList = data?.slides;
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
                    name: data.name,
                    ownerDisplayName: data.ownerDisplayName,
                    pace: {
                        active: data?.pace?.active ?? "",
                        counter: data?.pace?.counter ?? 0,
                        mode: data?.pace?.mode ?? "",
                        state: data?.pace?.state ?? "",
                        groupId: data?.pace?.groupId ?? null,
                    } as IPresentationPace,
                    voteKey: data?.voteKey ?? "",
                });
                globalContext.unBlockUI();
                // if last is true, navigate to the last item in slide list (used when creating a new slide), otherwise navigating according to pace field from api
                navigateToLastItem
                    ? navigate(`/presentation/${presentationId}/${mappedSlideList.at(-1)?.adminKey}/edit`)
                    : navigate(`/presentation/${presentationId}/${data?.pace?.active}/edit`);
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
            // }
            throw new Error("Unhandle http code");
        } catch (error) {
            console.log(error);
            globalContext.unBlockUI();
        }
    };

    useEffect(() => {
        if (location.state !== null && location.state !== undefined && presentationState.slides.length !== 0) {
            if ((location.state as any)?.code === PREFETCHING_REDIRECT_CODE) {
                updateSlideList();
            }
            return;
        }
        // if user enter url directly into the url bar, fetch slide list and presentation config directly
        getPresentationDetail();
        // eslint-disable-next-line
    }, []);

    // update slide list when there is change
    useEffect(() => {
        updateSlideList();
        // eslint-disable-next-line
    }, [presentationState.slides]);

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
            throw new Error("Unhandle http code");
        } catch (error) {
            console.log(error);
            globalContext.unBlockUI();
        }
    };

    // delete a slide
    const handleDeleteSlide = async (adminKey: string) => {
        if (slideData.length <= 1) {
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
            console.log(error);
            globalContext.unBlockUI();
        }
    };

    return (
        <Nav className="flex-column" variant="pills" activeKey={location.pathname}>
            {slideData &&
                slideData.map((nav, index) => (
                    <CustomSlideNav
                        key={nav.path}
                        slideNum={index + 1}
                        actions={{ onDelete: handleDeleteSlide }}
                        {...nav}
                    />
                ))}
            <Button variant="outline-primary" onClick={handleAddNewSlide}>
                <FontAwesomeIcon className="me-2" icon={faPlus} /> Trang chiếu mới
            </Button>
        </Nav>
    );
}
