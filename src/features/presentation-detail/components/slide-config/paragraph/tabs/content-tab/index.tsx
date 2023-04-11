import { Form, Stack } from "react-bootstrap";
import { usePresentFeature } from "../../../../../../../common/contexts/present-feature-context";

export default function ParagraphContentTab() {
    const { slideState, changeSlideState } = usePresentFeature();

    return (
        <Form>
            <Stack gap={4}>
                <Form.Group controlId="question">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control
                        name="question"
                        value={slideState.question}
                        onChange={(e) =>
                            changeSlideState({
                                question: e.target.value,
                            })
                        }
                        maxLength={150}
                        placeholder="Nhập tiêu đề"
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Văn bản</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={slideState.description}
                        onChange={(e) =>
                            changeSlideState({
                                description: e.target.value,
                            })
                        }
                        maxLength={800}
                        rows={10}
                        placeholder="Nhập văn bản"
                    />
                </Form.Group>
            </Stack>
        </Form>
    );
}
