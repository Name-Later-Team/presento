import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { SingleValue } from "react-select";
import { CustomPagination } from "../../../../common/components/custom-pagination";
import { Loading } from "../../../../common/components/loading";
import { Notification } from "../../../../common/components/notification";
import { BaseSelect } from "../../../../common/components/select";
import { TableMask } from "../../../../common/components/table-mask";
import DashboardPageSkeleton from "../../../../common/layouts/dashboard/dashboard-page-skeleton";
import {
    COMMON_CONSTANTS,
    ERROR_NOTIFICATION,
    PRESENTATION_DATE_TYPE,
    PRESENTATION_OWNER_TYPE,
    RESPONSE_CODE,
    SUCCESS_NOTIFICATION,
} from "../../../../constants/common-constants";
import PresentationService from "../../../../services/presentation-service";
import PresentationModal, { IPresentationForm, IPresentationModalProps } from "../../components/presentation-modal";
import PresentationListTable from "../../components/presentation-list-table";
moment.locale("vi");

const presentationTypeOption = [
    { value: PRESENTATION_OWNER_TYPE.OWNER, label: "Tôi sở hữu" },
    // { value: PRESENTATION_TYPE.COLLABORATOR, label: "Tôi cộng tác" },
];

const presentationDateTypeOption = [
    { value: PRESENTATION_DATE_TYPE.DESC, label: "Ngày sửa gần nhất" },
    { value: PRESENTATION_DATE_TYPE.ASC, label: "Ngày sửa xa nhất" },
];

export interface IPresentationListItem {
    closedForVoting: boolean;
    createdAt: string;
    identifier: string;
    name: string;
    ownerDisplayName: string;
    ownerIdentifier: string;
    pace: {
        active_slide_id: string;
        counter: number;
        mode: string;
        state: string;
    };
    totalSlides: number;
    updatedAt: string;
}

export interface IPresentationListPagination {
    count: number;
    limit: number;
    page: number;
}

const defaultPresentationModalState = { modalName: "", show: false, onHide: () => {} };

const defaultFilter = {
    ownerType: presentationTypeOption[0],
    dateType: presentationDateTypeOption[0],
};

export default function PresentationList() {
    // states
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState<IPresentationListItem[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: COMMON_CONSTANTS.pagination.defaultPage,
        totalRecords: COMMON_CONSTANTS.pagination.defaultTotal,
        rowsPerPage: COMMON_CONSTANTS.pagination.limit,
    });
    const [searchObject, setSearchObject] = useState(() => {
        return {
            page: COMMON_CONSTANTS.pagination.defaultPage,
            type: defaultFilter.ownerType.value,
            limit: COMMON_CONSTANTS.pagination.limit,
            order: defaultFilter.dateType.value,
        };
    });
    const [rerender, setRerender] = useState(false); // use this state to force rerender with the same search object
    const [presentationType, setPresentationType] = useState(defaultFilter.ownerType);
    const [presentationDateType, setPresentationDateType] = useState(defaultFilter.dateType);

    // fetch data
    useEffect(() => {
        const fetchPresentationsList = async () => {
            setIsLoading(true);
            try {
                const res = await PresentationService.getPresentationListAsync({
                    limit: searchObject.limit,
                    page: searchObject.page,
                    order: {
                        updatedAt: searchObject.order,
                    },
                });

                if (res.code === 200) {
                    const data = res.data?.items;
                    const pagination: IPresentationListPagination = res.data?.pagination;
                    if (data != null) setDataSource(data);
                    if (pagination != null)
                        setPagination({
                            currentPage: pagination.page,
                            rowsPerPage: pagination.limit,
                            totalRecords: pagination.count,
                        });

                    setIsLoading(false);
                    return;
                }

                throw new Error("Unhandle error code");
            } catch (err: any) {
                const { response } = err;

                if (response?.code === RESPONSE_CODE.VALIDATION_ERROR) {
                    Notification.notifyError(ERROR_NOTIFICATION.VALIDATION_ERROR);
                    console.error(response);
                    setIsLoading(false);
                    return;
                }

                console.error("PresentationList:", err);
                Notification.notifyError(ERROR_NOTIFICATION.FETCH_PRESENTATION_LIST);
                setIsLoading(false);
            }
        };
        fetchPresentationsList();
    }, [searchObject.limit, searchObject.page, searchObject.order, rerender]);

    // manage create & edit modal
    const [presentationModal, setPresentationModal] = useState<IPresentationModalProps>(defaultPresentationModalState);

    // processing functions
    const handlePageChange = (newPage: number) => {
        setSearchObject({ ...searchObject, page: newPage });
    };

    const handlePresentationTypeChange = (newValue: SingleValue<{ label: string; value: string }>) => {
        setSearchObject({ ...searchObject, type: newValue?.value || "" });
        setPresentationType({ label: newValue?.label || "", value: newValue?.value || "" });
    };

    const handlePresentationDateTypeChange = (newValue: SingleValue<{ label: string; value: string }>) => {
        setSearchObject({ ...searchObject, order: newValue?.value || "" });
        setPresentationDateType({ label: newValue?.label || "", value: newValue?.value || "" });
    };

    const triggerRerender = () => {
        // navigate to page 1 to see the change (last changed item is always the first item in page 1)
        if (searchObject.page === 1) {
            setRerender((prev) => !prev);
            setSearchObject((prev) => ({
                ...prev,
                order: defaultFilter.dateType.value,
            }));
            return;
        }

        setSearchObject((prev) => ({
            ...prev,
            page: 1,
            order: defaultFilter.dateType.value,
        }));
    };

    const closePresentationModal = (rerender?: boolean) => {
        setPresentationModal((prev) => ({
            ...prev,
            onHide: defaultPresentationModalState.onHide,
            show: false,
        }));
        if (rerender) triggerRerender();
    };

    // modal handling functions (resolve the promise to notify the modal to close or reject to keep the modal open)
    const handleCreateAPresentation = async (value: IPresentationForm) => {
        try {
            const res = await PresentationService.createPresentationAsync({ name: value.name });

            if (res.code === 201) {
                Notification.notifySuccess(SUCCESS_NOTIFICATION.CREATE_PRESENTATION);
                return Promise.resolve();
            }

            if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
                Notification.notifyError(ERROR_NOTIFICATION.VALIDATION_ERROR);
                return Promise.reject();
            }

            throw new Error("Unhandle error code");
        } catch (error) {
            console.error("PresentationList:", error);
            Notification.notifyError(ERROR_NOTIFICATION.CREATE_PRESENTATION);
            return Promise.reject();
        }
    };

    const handleDeleteAPresentation = (identifier: string) => {
        console.log(identifier);
    };

    const handleRenameModal = async (value: IPresentationForm, recordToChange?: IPresentationListItem) => {
        if (!recordToChange) return Promise.reject();

        try {
            const res = await PresentationService.updatePresentationAsync(recordToChange.identifier, {
                name: value.name,
            });

            if (res.code === 200) {
                Notification.notifySuccess(SUCCESS_NOTIFICATION.RENAME_PRESENTATION_SUCCESS);
                return Promise.resolve();
            }

            if (res.code === RESPONSE_CODE.VALIDATION_ERROR) {
                Notification.notifyError(ERROR_NOTIFICATION.VALIDATION_ERROR);
                return Promise.reject();
            }

            throw new Error("Unhandle error code");
        } catch (err) {
            console.error("PresentationModal:", err);
            Notification.notifyError(ERROR_NOTIFICATION.RENAME_PRESENTATION_FAILED);
            return Promise.reject();
        }
    };

    const openRenameModal = (record: IPresentationListItem) => {
        setPresentationModal({
            modalName: "Đổi tên bài trình bày",
            show: true,
            onSubmit: handleRenameModal,
            onHide: closePresentationModal,
            initData: record,
        });
    };

    // open an appropriate modal (make sure onSubmit function is a correct funtion to handle the action)
    const openCreateNewPresentationModal = () => {
        setPresentationModal({
            modalName: "Tạo mới bài trình bày",
            show: true,
            onSubmit: handleCreateAPresentation,
            onHide: closePresentationModal,
        });
    };

    return (
        <>
            <DashboardPageSkeleton pageTitle="Danh sách bài trình bày">
                <>
                    <Stack
                        className="mb-3 justify-content-between align-items-center flex-wrap"
                        direction="horizontal"
                        gap={3}
                    >
                        <div>
                            <Button variant="primary" onClick={openCreateNewPresentationModal}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                Tạo mới
                            </Button>
                        </div>

                        {/* filter container */}
                        <Stack className="flex-wrap" direction="horizontal" gap={3}>
                            <div className="d-flex justify-content-center align-items-center text-uppercase fw-bold">
                                <FontAwesomeIcon className="me-2" icon={faFilter} />
                                Bộ lọc
                            </div>

                            <Stack className="flex-wrap" direction="horizontal" gap={3}>
                                <BaseSelect
                                    options={presentationDateTypeOption}
                                    styles={{
                                        control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            minWidth: "200px",
                                        }),
                                    }}
                                    onChange={handlePresentationDateTypeChange}
                                    value={presentationDateType}
                                />

                                <BaseSelect
                                    options={presentationTypeOption}
                                    styles={{
                                        control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            minWidth: "200px",
                                        }),
                                    }}
                                    onChange={handlePresentationTypeChange}
                                    value={presentationType}
                                />
                            </Stack>
                        </Stack>
                    </Stack>

                    <TableMask loading={isLoading} indicator={<Loading color={"primary"} />}>
                        <PresentationListTable
                            dataSource={dataSource}
                            pagination={pagination}
                            action={{
                                handleDeletePresentation: handleDeleteAPresentation,
                                handleOpenRenameModal: openRenameModal,
                            }}
                        />

                        <div className="d-inline-flex w-100 mt-4" style={{ overflowX: "auto" }}>
                            <div className="mx-auto">
                                <CustomPagination {...pagination} pageChange={handlePageChange} />
                            </div>
                        </div>
                    </TableMask>
                </>
            </DashboardPageSkeleton>

            {/* Modal for handling create a new presentation or rename a presentation */}
            <PresentationModal {...presentationModal} />
        </>
    );
}
