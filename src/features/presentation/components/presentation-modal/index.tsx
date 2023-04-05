import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup, Modal, Spinner, Stack } from "react-bootstrap";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IPresentationListItem } from "../../pages/presentation-list";

export interface IPresentationModalProps {
    modalName: string;
    show: boolean;
    onHide: (rerender?: boolean) => void | undefined;
    /**
     * RESOLVE the promise to close the modal or REJECT the promise to keep the modal open
     */
    onSubmit?: (formValues: IPresentationForm, recordToChange?: IPresentationListItem) => Promise<void>;
    initData?: IPresentationListItem;
}

export interface IPresentationForm {
    name: string;
}

// define all placeholders here
const presentationFormPlaceholders = {
    name: "Tên bài trình bày của bạn",
};

const presentationSchema = z.object({
    name: z
        .string({ required_error: "Tên bài trình bày không được bỏ trống" })
        .trim()
        .min(1, { message: "Tên bài trình bày không được bỏ trống" }),
});

export default function PresentationModal(props: IPresentationModalProps) {
    const { show, onHide, onSubmit, initData, modalName } = props;

    const [isLoading, setIsLoading] = useState(false);
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IPresentationForm>({
        resolver: zodResolver(presentationSchema),
        defaultValues: initData && { name: initData.name },
    });

    useEffect(() => {
        if (show) reset(initData && { name: initData.name });
    }, [initData, reset, modalName, show, onHide, onSubmit]);

    const handleCloseForm = (rerender?: boolean) => {
        reset({
            name: "",
        });
        onHide && onHide(rerender);
    };

    const handleSubmitForm: SubmitHandler<IPresentationForm> = async (value) => {
        if (!onSubmit) return;

        // call handling function
        try {
            setIsLoading(true);
            await onSubmit(value, initData && { ...initData });

            setIsLoading(false);
            handleCloseForm(true);
        } catch (_) {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={() => handleCloseForm()} backdrop="static" keyboard={false} size="lg" centered>
            <Modal.Body>
                <Modal.Title className="mb-3">{modalName}</Modal.Title>

                <Form onSubmit={handleSubmit(handleSubmitForm)}>
                    <FormGroup className="mb-3">
                        <Controller
                            control={control}
                            name="name"
                            defaultValue={""}
                            render={({ field: { ref, value, onChange } }) => (
                                <FormControl
                                    ref={ref}
                                    value={value}
                                    onChange={onChange}
                                    type="text"
                                    placeholder={presentationFormPlaceholders.name}
                                    disabled={isLoading}
                                    autoFocus
                                />
                            )}
                        />

                        <Form.Text className="text-danger">{errors?.name?.message}</Form.Text>
                    </FormGroup>

                    <Stack direction="horizontal" className="justify-content-end align-items-center">
                        <Button
                            variant="text-secondary"
                            type="button"
                            className="me-2"
                            onClick={() => handleCloseForm()}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>

                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading && <Spinner animation="border" role="status" size="sm" className="me-2" />}
                            Lưu
                        </Button>
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
