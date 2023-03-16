import { useState } from "react";
import { Alert, Button, Col, Row, Stack } from "react-bootstrap";
import { SingleValue } from "react-select";
import { BaseSelect } from "../../../../common/components/select";
import { initSlideState, usePresentFeature } from "../../../../common/contexts/present-feature-context";
import PresentationSlide from "../../components/presentation-slide";
import HeadingConfig from "../../components/slide-config/heading";
import MultipleChoiceConfig from "../../components/slide-config/multiple-choice";
import ParagraphConfig from "../../components/slide-config/paragraph";
import "./style.scss";

interface ISlideTypeOption {
	value: string;
	label: string;
}

const slideTypeLabels: { [type: string]: string } = {
	multiple_choice: "Multiple Choice",
	heading: "Tiêu đề",
	paragraph: "Đoạn văn",
};

const slideTypeComponents: { [type: string]: JSX.Element } = {
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
	const { slideState, changeSlideState } = usePresentFeature();
	const [showAlert, setShowAlert] = useState(true);

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
			adminKey: oldSlideState.adminKey,
			createdAt: oldSlideState.createdAt,
			updatedAt: oldSlideState.updatedAt,
		});
	};
	return (
		<Row className="edit-presentation">
			<Col className="edit-presentation__col edit-presentation__col--left">
				<PresentationSlide />
			</Col>
			<Col className="edit-presentation__col edit-presentation__col--right">
				<div className="edit-presentation__slide-config">
					<Stack>
						<Alert show={showAlert} className="m-0 mb-3" variant="primary">
							<p className="m-0 mb-2 fw-bolder text-uppercase">Nhắc nhở</p>
							<p className="m-0 mb-3">Lưu trước khi chuyển trang chiếu hoặc chuyển trang</p>
							<div className="d-flex justify-content-end">
								<Button size="sm" onClick={() => setShowAlert(false)} variant="outline-primary">
									Đã hiểu
								</Button>
							</div>
						</Alert>

						<p className="m-0 mb-3">Loại trang trình bày</p>

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
						/>

						<hr className="my-3" />

						{slideTypeComponents[slideState.type]}
					</Stack>
				</div>
			</Col>
		</Row>
	);
}
