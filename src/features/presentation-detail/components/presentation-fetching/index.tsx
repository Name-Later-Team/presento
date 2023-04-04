import { faChartSimple, faHeading, faParagraph, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { Spinner, Stack } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { usePresentFeature } from "../../../../common/contexts/present-feature-context";
import PresentationService from "../../../../services/presentation-service";
import "./style.scss";
import DataMappingUtil from "../../../../common/utils/data-mapping-util";
import { ERROR_NOTIFICATION, RESPONSE_CODE } from "../../../../constants";
import { AlertBuilder } from "../../../../common/components/alert";

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
    const { presentationState, resetPresentationState } = usePresentFeature();
    const navigate = useNavigate();

    useEffect(() => {
        const getPresentationDetail = async () => {
            const alert = new AlertBuilder()
                .reset()
                .setTitle("Lỗi")
                .setAlertType("error")
                .setConfirmBtnText("OK")
                .setOnConfirm(() => navigate("/dashboard/presentation-list"));
            try {
                // get slide list and presentation config
                const res = await PresentationService.getPresentationDetailAsync(presentationId || "");
                if (res.code === 200) {
                    const data = res.data as any;
                    const mappedPresentationState = DataMappingUtil.mapPresentationStateFromApiData(
                        presentationState,
                        data
                    );
                    resetPresentationState(mappedPresentationState);
                    // navigate to the edit page if there is at least 1 slide in the presentation
                    mappedPresentationState.slides.length !== 0 &&
                        navigate(`/presentation/${presentationId}/${data?.pace?.active_slide_id}/edit`, {
                            state: { code: PREFETCHING_REDIRECT_CODE },
                            replace: true,
                        });
                    return;
                }

                if (
                    res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION ||
                    res.code === RESPONSE_CODE.VALIDATION_ERROR
                ) {
                    alert.setText(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION).getAlert().fireAlert();
                    return;
                }

                throw new Error("Unhandle http code");
            } catch (error: any) {
                const res = error?.response?.data;
                if (
                    res.code === RESPONSE_CODE.CANNOT_FIND_PRESENTATION ||
                    res.code === RESPONSE_CODE.VALIDATION_ERROR
                ) {
                    alert.setText(ERROR_NOTIFICATION.CANNOT_FIND_PRESENTATION).getAlert().fireAlert();
                    return;
                }

                console.error(error);
                alert.setText(ERROR_NOTIFICATION.FETCH_PRESENTATION_DETAIL).getAlert().fireAlert();
            }
        };
        getPresentationDetail();
        // eslint-disable-next-line
    }, [presentationId]);

    return (
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
