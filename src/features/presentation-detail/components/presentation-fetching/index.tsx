import { faChartSimple, faHeading, faParagraph, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Spinner, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
    IPresentationPace,
    IPresentationSlide,
    usePresentFeature,
} from "../../../../common/contexts/present-feature-context";
import PresentationService from "../../../../services/presentation-service";
import "./style.scss";

export const SLIDE_TYPE: {
    [type: string]: {
        icon: IconDefinition;
        label: string;
    };
} = {
    multiple_choice: { icon: faChartSimple, label: "Multiple Choice" },
    heading: { icon: faHeading, label: "Tiêu đề" },
    paragraph: { icon: faParagraph, label: "Đoạn văn" },
};

export const PREFETCHING_REDIRECT_CODE = "AQsyfXWrig";

export default function PresentationFetching() {
    const { presentationId } = useParams();
    const { presentationState, changePresentationState } = usePresentFeature();
    const navigate = useNavigate();

    useEffect(() => {
        const getPresentationDetail = async () => {
            try {
                // get slide list and presentation config
                const res = await PresentationService.getPresentationDetailAsync(presentationId || "");
                if (res.code === 200) {
                    const data = res.data as any;
                    const slideList = data.slides;
                    const mappedSlideList: IPresentationSlide[] = slideList.map(
                        (item: any) =>
                            ({
                                id: item?.id ?? "",
                                adminKey: item?.admin_key ?? "",
                                type: item?.type ?? "",
                                position: item?.position ?? 1,
                            } as IPresentationSlide)
                    );
                    changePresentationState({
                        ...presentationState,
                        name: data.name,
                        ownerDisplayName: data.ownerDisplayName,
                        slides: mappedSlideList,
                        voteKey: data?.voteKey ?? "",
                        votingCode: data?.votingCode ?? "",
                        pace: {
                            active: data?.pace?.active ?? "",
                            counter: data?.pace?.counter ?? 0,
                            mode: data?.pace?.mode ?? "",
                            state: data?.pace?.state ?? "",
                            groupId: data?.pace?.groupId ?? null,
                        } as IPresentationPace,
                    });
                    // navigate to the edit page if there is at least 1 slide in the presentation
                    slideList.length !== 0 &&
                        navigate(`/presentation/${presentationId}/${data?.pace?.active}/edit`, {
                            state: { code: PREFETCHING_REDIRECT_CODE },
                            replace: true,
                        });
                    return;
                }
                // const alert = new AlertBuilder()
                // 	.setAlertType("error")
                // 	.setConfirmBtnText("Quay lại")
                // 	.preventDismiss()
                // 	.setOnConfirm(() => navigate(`../`));
                // if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
                // 	const errors = (res.errors as any[]) || null;
                // 	if (errors) {
                // 		const msg = errors[0]?.message;
                // 		alert.setTitle(msg);
                // 		alert.getAlert().fireAlert();
                // 		return;
                // 	}
                // 	return;
                // }
                // if (res.code === RESPONSE_CODE.PRESENTATION_NOT_FOUND) {
                // 	alert.setTitle("Bài trình bày không tồn tại");
                // 	alert.getAlert().fireAlert();
                // 	return;
                // }
                throw new Error("Unhandle http code");
            } catch (error) {
                console.log(error);
            }
        };
        getPresentationDetail();
        // eslint-disable-next-line
    }, [presentationId]);

    return (
        // <div className="d-flex h-100 align-items-center justify-content-center">
        //     <Stack className="app__card py-5 px-4 my-auto text-center" gap={3}>
        //         <div className="d-flex justify-content-center mb-4">
        //             <div className="text-start text-primary text-capitalize">
        //                 <div style={{ fontSize: "2rem" }}>realtime</div>
        //                 <div className="text-black fw-bolder" style={{ fontSize: "3.5rem" }}>
        //                     learning platform
        //                 </div>
        //                 <div className="text-black fst-italic" style={{ fontSize: "1.9rem" }}>
        //                     by H2A team
        //                 </div>
        //             </div>
        //         </div>

        //         <div>
        //             <Spinner animation="grow" variant="primary" />
        //         </div>
        //     </Stack>
        // </div>
        <div className="presentation-fetching">
            <Stack className="presentation-fetching__card py-5 px-4 my-auto text-center" gap={4}>
                <div className="presentation-fetching__card__app-logo-container">
                    <img
                        className="presentation-fetching__card__app-logo-container__app-logo"
                        src="/images/logo-presento-transparent.png"
                        alt="app-logo"
                        loading="lazy"
                    />
                </div>

                <div>
                    <Spinner animation="grow" variant="primary" />
                </div>
            </Stack>
        </div>
    );
}
