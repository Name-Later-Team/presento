import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup, Stack } from "react-bootstrap";
import { z } from "zod";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomizedTooltip from "../../../components/tooltip";
import { usePresentFeature } from "../../../contexts/present-feature-context";
import { IBaseComponent } from "../../../interfaces";
import PresentationService from "../../../../services/presentation-service";
import { Notification } from "../../../components/notification";
import { ERROR_NOTIFICATION, RESPONSE_CODE, SUCCESS_NOTIFICATION } from "../../../../constants";

const enum COMPONENT_MODE {
    display,
    edit,
}

export interface IRenameForm {
    name: string;
}

interface IPresentationInfoProps extends IBaseComponent {
    doesWhenEditModeOn?: () => void;
    doesWhenEditModeOff?: () => void;
}

// define all placeholders here
const renameFormPlaceholders = {
    name: "Tên bài trình bày của bạn",
};

const renameFormSchema = z.object({
    name: z
        .string({ required_error: "Tên bài trình bày không được bỏ trống" })
        .trim()
        .min(1, { message: "Tên bài trình bày không được bỏ trống" }),
});

const smallScreenMediaQuery = "(max-width: 520px)";

export default function PresentationInfo(props: IPresentationInfoProps) {
    const { doesWhenEditModeOn, doesWhenEditModeOff } = props;
    // states
    const [mode, setMode] = useState<COMPONENT_MODE>(COMPONENT_MODE.display);
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia(smallScreenMediaQuery).matches);

    // hooks
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IRenameForm>({
        resolver: zodResolver(renameFormSchema),
    });

    // contexts
    const { presentationState, resetPresentationState } = usePresentFeature();

    useEffect(() => {
        if (mode === COMPONENT_MODE.edit) reset({ name: presentationState.name });
    }, [presentationState, mode, reset]);

    useEffect(() => {
        const onChange = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
        const mediaQueryList = window.matchMedia(smallScreenMediaQuery);
        mediaQueryList.addEventListener("change", onChange);
        return () => {
            mediaQueryList.removeEventListener("change", onChange);
        };
    }, []);

    useEffect(() => {
        if (errors.name?.message) {
            Notification.notifyError(errors.name.message);
        }
    }, [errors]);

    const handleChangeMode = (newMode: COMPONENT_MODE) => {
        switch (newMode) {
            case COMPONENT_MODE.display: {
                doesWhenEditModeOff && doesWhenEditModeOff();
                break;
            }

            case COMPONENT_MODE.edit: {
                doesWhenEditModeOn && doesWhenEditModeOn();
                break;
            }

            default: {
                return;
            }
        }

        setMode(newMode);
    };

    const handleSubmitForm: SubmitHandler<IRenameForm> = async (value) => {
        try {
            const res = await PresentationService.updatePresentationAsync(presentationState.identifier, {
                name: value.name,
            });

            if (res.code === 200) {
                Notification.notifySuccess(SUCCESS_NOTIFICATION.RENAME_PRESENTATION_SUCCESS);
                handleChangeMode(COMPONENT_MODE.display);
                resetPresentationState({
                    name: value.name,
                });
                return;
            }

            throw new Error("Unhandle error code");
        } catch (err: any) {
            const res = err?.response?.data;

            if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
                Notification.notifyError(ERROR_NOTIFICATION.VALIDATION_ERROR);
                return;
            }

            console.error("PresentationModal:", err);
            Notification.notifyError(ERROR_NOTIFICATION.RENAME_PRESENTATION_FAILED);
            return;
        }
    };

    const renderBasedOnMode = () => {
        if (isSmallScreen && mode !== COMPONENT_MODE.edit) {
            return (
                <Button
                    className="px-2 text-primary"
                    variant="light"
                    onClick={() => handleChangeMode(COMPONENT_MODE.edit)}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </Button>
            );
        }
        switch (mode) {
            case COMPONENT_MODE.display: {
                return (
                    <Stack className="justify-content-center ms-1">
                        <p
                            className="mb-0"
                            style={{ fontSize: "1.09rem", fontWeight: 600 }}
                            onClick={() => handleChangeMode(COMPONENT_MODE.edit)}
                        >
                            <span id="presentation-info__rename-trigger" style={{ cursor: "text" }}>
                                {presentationState.name}
                                <FontAwesomeIcon className="p-0 ms-2 text-primary" icon={faEdit} />
                            </span>
                            <CustomizedTooltip anchorSelect="#presentation-info__rename-trigger" place="right">
                                Đổi tên bài trình bày
                            </CustomizedTooltip>
                        </p>
                        <span className="mb-0" style={{ fontSize: "0.75rem" }}>
                            Được tạo bởi {presentationState.ownerDisplayName}
                        </span>
                    </Stack>
                );
            }

            case COMPONENT_MODE.edit: {
                return (
                    <Form className="d-flex align-items-center" onSubmit={handleSubmit(handleSubmitForm)}>
                        <FormGroup>
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
                                        placeholder={renameFormPlaceholders.name}
                                        autoFocus
                                    />
                                )}
                            />
                        </FormGroup>

                        <Stack direction="horizontal" className="justify-content-end align-items-center">
                            <Button className="ms-1 px-3 py-0 h-100" variant="primary" type="submit">
                                Lưu
                            </Button>

                            <Button
                                className="ms-1 px-3 py-0 h-100"
                                variant="secondary"
                                type="button"
                                onClick={() => handleChangeMode(COMPONENT_MODE.display)}
                            >
                                Hủy
                            </Button>
                        </Stack>
                    </Form>
                );
            }

            default:
                return null;
        }
    };

    return <>{renderBasedOnMode()}</>;
}
