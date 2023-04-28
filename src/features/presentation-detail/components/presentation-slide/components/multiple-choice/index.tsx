import { Stack } from "react-bootstrap";
import { usePresentFeature } from "../../../../../../common/contexts/present-feature-context";
import PresentationChart from "../../../presentation-chart";
import "./style.scss";

export default function MultipleChoiceSlideComponent() {
    const { slideState } = usePresentFeature();

    return (
        <Stack gap={3} className="h-100">
            <div className="multiple-choice-component__question text-start">
                <span
                    style={{ fontSize: `min(calc(${slideState.fontSize}vw * 0.1), ${slideState.fontSize}px)` }}
                    className="m-0"
                >
                    {slideState.question}
                </span>
            </div>

            <div className="multiple-choice-component__chart flex-grow-1">
                <PresentationChart />
            </div>
        </Stack>
    );
}
