import { Alert, Col, Row, Stack } from "react-bootstrap";
import { SingleValue } from "react-select";
import { BaseSelect } from "../../../../common/components/select";
import { initSlideState, usePresentFeature } from "../../../../common/contexts/present-feature-context";
import PresentationSlide from "../../components/presentation-slide";
import HeadingConfig from "../../components/slide-config/heading";
import MultipleChoiceConfig from "../../components/slide-config/multiple-choice";
import ParagraphConfig from "../../components/slide-config/paragraph";
import "./style.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";

interface ISlideTypeOption {
    value: string;
    label: string;
}

const slideTypeLabels: { [type: string]: string } = {
    multiple_choice: "Multiple Choice",
    heading: "Tiêu đề",
    paragraph: "Đoạn văn",
};

const slideTypeConfigComponents: { [type: string]: JSX.Element } = {
    multiple_choice: <MultipleChoiceConfig />,
    heading: <HeadingConfig />,
    paragraph: <ParagraphConfig />,
};

const slideTypeOptions: ISlideTypeOption[] = [
    { value: "multiple_choice", label: slideTypeLabels["multiple_choice"] },
    { value: "heading", label: slideTypeLabels["heading"] },
    { value: "paragraph", label: slideTypeLabels["paragraph"] },
];

export default function EditPresentation() {
    const { slideState, presentationState, indicators, changeSlideState, resetPresentationState } = usePresentFeature();

    const slideType: ISlideTypeOption = {
        value: slideState.type,
        label: slideTypeLabels[slideState.type],
    };

    const handleSlideTypeChange = (newSlideType: SingleValue<{ value: string; label: string }>) => {
        const oldSlideState = { ...slideState };
        changeSlideState({
            ...initSlideState,
            type: newSlideType?.value || "",
            position: oldSlideState.position,
            id: oldSlideState.id,
            presentationId: oldSlideState.presentationId,
            presentationSeriesId: oldSlideState.presentationSeriesId,
            createdAt: oldSlideState.createdAt,
            updatedAt: oldSlideState.updatedAt,
        });
        // change the preview icon of the slide
        const newSlides = [...presentationState.slides];
        for (let element of newSlides) {
            if (element.id.toString() === oldSlideState.id.toString()) {
                element.type = newSlideType?.value || "";
                resetPresentationState({
                    slides: newSlides,
                });
                break;
            }
        }
    };

    return (
        <Row className="edit-presentation">
            <Col xxl={9} xl={8} lg={8} md={12} className="edit-presentation__col edit-presentation__col--left">
                {indicators.hasResult && (
                    <Alert className="d-flex m-0 mb-3" variant="primary">
                        <p className="m-0 me-2">
                            <FontAwesomeIcon icon={faSquarePollVertical} size="lg" />
                        </p>
                        <p className="m-0">
                            Một số tùy chọn thay đổi nội dung bị hạn chế do trang trình bày đã có kết quả
                        </p>
                    </Alert>
                )}

                <PresentationSlide />
            </Col>
            <Col xxl={3} xl={4} lg={4} md={12} className="edit-presentation__col edit-presentation__col--right">
                <div className="edit-presentation__slide-config">
                    <Stack>
                        <h4 className="text-uppercase fw-bold text-primary m-0 mt-1 mb-3">Nội dung</h4>

                        <hr className="m-0 mb-3" />

                        <p className="m-0 mb-2">Loại trang trình bày</p>

                        <BaseSelect
                            options={slideTypeOptions}
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    minWidth: "200px",
                                }),
                            }}
                            onChange={handleSlideTypeChange}
                            value={slideType}
                            isDisabled={indicators.hasResult}
                        />

                        <hr className="my-3" />

                        {slideTypeConfigComponents[slideState.type]}
                    </Stack>
                </div>
            </Col>
        </Row>
    );
}
