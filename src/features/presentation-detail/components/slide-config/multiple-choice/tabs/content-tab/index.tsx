import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Stack } from "react-bootstrap";
import { usePresentFeature } from "../../../../../../../common/contexts/present-feature-context";

export default function MultipleChoiceContentTab() {
    const { slideState, changeSlideState } = usePresentFeature();

    const handleChangeOptionText = (key: string, newValue: string) => {
        const newState: { key: string; value: string }[] = [...slideState.options];
        for (let item of newState) {
            if (item.key.toString() === key) {
                item.value = newValue;
                break;
            }
        }

        changeSlideState({
            options: newState,
        });
    };

    const handleDeleteOption = (key: string) => {
        changeSlideState({
            options: slideState.options.filter((item) => item.key !== key),
            result: slideState.result.filter((item) => item.key !== key),
        });
    };

    const handleAddNewOption = () => {
        const newState: { key: string; value: string }[] = [...slideState.options];
        const newKey = Date.now().toString();
        newState.push({
            key: newKey,
            value: "",
        });
        changeSlideState({
            options: newState,
            result: [
                ...slideState.result,
                {
                    key: newKey,
                    value: 0,
                },
            ],
        });
    };

    return (
        <Form>
            <Stack gap={4}>
                <Form.Group controlId="question">
                    <Form.Label>Câu hỏi của bạn</Form.Label>
                    <Form.Control
                        name="question"
                        value={slideState.question}
                        onChange={(e) =>
                            changeSlideState({
                                question: e.target.value,
                            })
                        }
                        maxLength={150}
                        placeholder="Nhập câu hỏi"
                    />
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Mô tả câu hỏi</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={slideState.description}
                        onChange={(e) =>
                            changeSlideState({
                                description: e.target.value,
                            })
                        }
                        maxLength={250}
                        rows={3}
                        placeholder="Nhập mô tả câu hỏi"
                    />
                </Form.Group>

                <Stack gap={2}>
                    <Form.Label>Các lựa chọn</Form.Label>
                    {slideState.options.map((option) => (
                        <Form.Check key={option.key} className="d-flex p-0">
                            {/* Should remove p-0 class of the above element when using the code below */}
                            {/* <div className="d-flex align-items-center justify-content-center me-2">
								<Form.Check.Input
									style={{ cursor: "pointer" }}
									checked={option.key === slideState.selectedOption}
									type="radio"
									onChange={() =>
										changeSlideState({
											...slideState,
											selectedOption: option.key,
										})
									}
								/>
							</div> */}
                            <Form.Check.Label className="w-100">
                                <div className="d-flex">
                                    <Form.Control
                                        onChange={(e) =>
                                            handleChangeOptionText(e.target.name as string, e.target.value)
                                        }
                                        name={option.key}
                                        value={option.value}
                                        maxLength={50}
                                        placeholder="Nhập lựa chọn"
                                    />
                                    <Button
                                        variant="light"
                                        className="text-danger ms-2 p-2 h-100"
                                        title="Xóa lựa chọn"
                                        onClick={() => handleDeleteOption(option.key)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </div>
                            </Form.Check.Label>
                        </Form.Check>
                    ))}

                    <Button onClick={handleAddNewOption}>
                        <FontAwesomeIcon className="me-2" icon={faPlus} /> Thêm lựa chọn
                    </Button>

                    {/* <Form.Text muted>Tích chọn để đánh dấu đáp án đúng</Form.Text> */}
                </Stack>
            </Stack>
        </Form>
    );
}
