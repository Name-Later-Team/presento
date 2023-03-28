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
    PRESENTATION_TYPE,
    RESPONSE_CODE,
    SUCCESS_NOTIFICATION,
} from "../../../../constants/common-constants";
import PresentationService from "../../../../services/presentation-service";
import PresentationModal, { IPresentationForm } from "../../components/presentation-modal";
import PresentationListTable from "../../components/presentation-list-table";
moment.locale("vi");

const presentationTypeOption = [
    { value: PRESENTATION_TYPE.OWNER, label: "Tôi sở hữu" },
    // { value: PRESENTATION_TYPE.COLLABORATOR, label: "Tôi cộng tác" },
];

export interface IPresentationListItem {
    closedForVoting: boolean;
    createdAt: string;
    id: number;
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
            type: PRESENTATION_TYPE.OWNER,
            limit: COMMON_CONSTANTS.pagination.limit,
        };
    });
    const [rerender] = useState(false); // use this state to force rerender with the same search object
    const [presentationType, setPresentationType] = useState(presentationTypeOption[0]);

    // fetch data
    useEffect(() => {
        const fetchPresentationsList = async () => {
            setIsLoading(true);
            try {
                const res = await PresentationService.getPresentationListAsync({
                    limit: searchObject.limit,
                    page: searchObject.page,
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
    }, [searchObject.limit, searchObject.page, rerender]);

    // manage create & edit modal
    const [presentationModal, setPresentationModal] = useState<{
        modalName: string;
        onHide: () => void | undefined;
        onSubmit?: (formValues: IPresentationForm) => Promise<void>;
        show: boolean;
        initData?: IPresentationForm;
    }>(defaultPresentationModalState);

    // processing functions
    const handlePageChange = (newPage: number) => {
        setSearchObject({ ...searchObject, page: newPage });
    };

    const handlePresentationTypeChange = (newValue: SingleValue<{ label: string; value: string }>) => {
        setSearchObject({ ...searchObject, type: newValue?.value || "" });
        setPresentationType({ label: newValue?.label || "", value: newValue?.value || "" });
    };

    const closePresentationModal = () => {
        setPresentationModal((prev) => ({
            ...prev,
            onHide: defaultPresentationModalState.onHide,
            show: false,
        }));
        // navigate to page 1 to see the change (last changed item is always the first item in page 1)
        setSearchObject((prev) => ({
            ...prev,
            page: 1,
        }));
    };

    const handleDeleteAPresentation = (identifier: string) => {
        console.log(identifier);
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
            console.log("PresentationList:", error);
            Notification.notifyError(ERROR_NOTIFICATION.CREATE_PRESENTATION);
            return Promise.reject();
        }
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
                    <Stack className="mb-3 justify-content-between align-items-center" direction="horizontal">
                        <div>
                            <Button variant="primary" onClick={openCreateNewPresentationModal}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" />
                                Tạo mới
                            </Button>
                        </div>

                        {/* filter container */}
                        <Stack direction="horizontal" gap={3}>
                            <div className="d-flex justify-content-center align-items-center text-uppercase fw-bold">
                                <FontAwesomeIcon className="me-2" icon={faFilter} />
                                Bộ lọc
                            </div>
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

                    <TableMask loading={isLoading} indicator={<Loading color={"primary"} />}>
                        <PresentationListTable
                            dataSource={dataSource}
                            pagination={pagination}
                            action={{ handleDeletePresentation: handleDeleteAPresentation }}
                        />

                        <div className="d-inline-flex justify-content-center w-100 mt-4">
                            <CustomPagination {...pagination} pageChange={handlePageChange} />
                        </div>
                    </TableMask>
                </>
            </DashboardPageSkeleton>

            {/* Modal for handling create a new presentation or rename a presentation */}
            <PresentationModal
                modalName={presentationModal.modalName}
                show={presentationModal.show}
                onHide={presentationModal.onHide}
                onSubmit={presentationModal.onSubmit}
                initData={presentationModal.initData}
            />
        </>
    );
}
