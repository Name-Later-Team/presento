import { usePresentFeature } from "../../../../../../common/contexts/present-feature-context";
import "./style.scss";

export default function ParagraphSlideComponent() {
    const { slideState } = usePresentFeature();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <div className="paragraph-component__title">
                <span
                    style={{
                        fontSize: `min(calc(${slideState.fontSize + 12}vw * 0.1), ${slideState.fontSize + 12}px)`,
                    }}
                >
                    {slideState.question}
                </span>
            </div>
            <div className="paragraph-component__paragraph text-muted">
                <span
                    style={{
                        fontSize: `min(calc(${slideState.fontSize - 12}vw * 0.1), ${slideState.fontSize + 12}px)`,
                    }}
                >
                    {slideState.description}
                </span>
            </div>
        </div>
    );
}
