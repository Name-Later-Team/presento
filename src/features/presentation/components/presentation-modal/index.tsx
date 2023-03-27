import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup, Modal, Spinner, Stack } from "react-bootstrap";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export interface IPresentationModalProps {
    modalName: string;
    show: boolean;
    onHide: () => void | undefined;
    /**
     * RESOLVE the promise to close the modal or REJECT the promise to keep the modal open
     */
    onSubmit?: (formValues: IPresentationForm) => Promise<void>;
    initData?: IPresentationForm;
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
        defaultValues: initData,
    });

    useEffect(() => {
        reset(initData);
    }, [initData, reset]);

    const handleCloseForm = () => {
        reset({
            name: "",
        });
        onHide && onHide();
    };

    const handleSubmitForm: SubmitHandler<IPresentationForm> = (value) => {
        if (onSubmit == null) return;

        // call handling function
        setIsLoading(true);
        onSubmit(value)
            .then(() => {
                setIsLoading(false);
                handleCloseForm();
            })
            .catch(() => setIsLoading(false));
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg" centered>
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
                            onClick={handleCloseForm}
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
