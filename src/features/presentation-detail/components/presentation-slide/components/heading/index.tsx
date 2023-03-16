import { usePresentFeature } from "../../../../../../common/contexts/present-feature-context";
import "./style.scss";

export default function HeadingSlideComponent() {
	const { slideState } = usePresentFeature();

	return (
		<div className="d-flex flex-column justify-content-center align-items-center h-100">
			<div className="heading-component__heading mb-3">
				<span style={{ fontSize: `${slideState.fontSize + 15}px` }}>{slideState.question}</span>
			</div>
			<div className="heading-component__sub-heading text-muted">
				<span style={{ fontSize: `${slideState.fontSize - 15}px` }}>{slideState.description}</span>
			</div>
		</div>
	);
}
