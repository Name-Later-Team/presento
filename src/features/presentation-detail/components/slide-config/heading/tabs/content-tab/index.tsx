import { Form, Stack } from "react-bootstrap";
import { usePresentFeature } from "../../../../../../../common/contexts/present-feature-context";

export default function HeadingContentTab() {
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
                        autoComplete="off"
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Tiêu đề phụ</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={slideState.description}
                        onChange={(e) =>
                            changeSlideState({
                                description: e.target.value,
                            })
                        }
                        maxLength={500}
                        rows={5}
                        placeholder="Nhập tiêu đề phụ"
                        autoComplete="off"
                    />
                </Form.Group>
            </Stack>
        </Form>
    );
}
