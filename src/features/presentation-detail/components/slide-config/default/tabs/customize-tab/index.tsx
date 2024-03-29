import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Stack } from "react-bootstrap";
import { usePresentFeature } from "../../../../../../../common/contexts/present-feature-context";

const FONT_SIZE_STEP = 1;

const FONT_SIZE_RANGE = {
    MAX: 42,
    MIN: 24,
};

export default function CustomizeTab() {
    const { slideState, changeSlideState } = usePresentFeature();

    return (
        <Form>
            <Stack gap={4}>
                <Stack gap={2}>
                    <Form.Label>Tùy chỉnh trang trình bày</Form.Label>
                    <Form.Check
                        checked={slideState.enableVoting}
                        type="switch"
                        id="enableVoting"
                        label="Cho phép bầu chọn"
                        onChange={() =>
                            changeSlideState({
                                enableVoting: !slideState.enableVoting,
                            })
                        }
                    />
                    <Form.Check
                        checked={slideState.showInstructionBar}
                        type="switch"
                        id="showInstructionBar"
                        label="Hiện thanh hướng dẫn"
                        onChange={() =>
                            changeSlideState({
                                showInstructionBar: !slideState.showInstructionBar,
                            })
                        }
                    />
                </Stack>

                <Stack gap={2}>
                    <Form.Label>Cỡ chữ</Form.Label>
                    <Stack direction="horizontal" gap={2}>
                        <Button
                            size="sm"
                            disabled={slideState.fontSize <= FONT_SIZE_RANGE.MIN}
                            onClick={() => {
                                if (slideState.fontSize <= FONT_SIZE_RANGE.MIN) return;
                                changeSlideState({
                                    fontSize: slideState.fontSize - FONT_SIZE_STEP,
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>

                        <Button
                            size="sm"
                            disabled={slideState.fontSize >= FONT_SIZE_RANGE.MAX}
                            onClick={() => {
                                if (slideState.fontSize >= FONT_SIZE_RANGE.MAX) return;
                                changeSlideState({
                                    fontSize: slideState.fontSize + FONT_SIZE_STEP,
                                });
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Form>
    );
}
