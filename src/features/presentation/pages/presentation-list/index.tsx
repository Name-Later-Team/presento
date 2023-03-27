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
import { useGlobalContext } from "../../../../common/contexts";
import DashboardPageSkeleton from "../../../../common/layouts/dashboard/dashboard-page-skeleton";
import {
    COMMON_CONSTANTS,
    ERROR_NOTIFICATION,
    PRESENTATION_TYPE,
    RESPONSE_CODE,
} from "../../../../constants/common-constants";
import PresentationService from "../../../../services/presentation-service";
import PresentationListTable from "../../components/presentation-list-table";
moment.locale("vi");

const fakeData = [
    {
        createdAt: "2023-02-17T10:06:47.145Z",
        updatedAt: "2023-02-17T10:10:44.494Z",
        id: 1,
        name: "demo1",
        seriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
        voteKey: "tKiHYGEAqiZbvuopGPY3X",
        ownerId: 17,
        ownerDisplayName: "Hung Nguyen Hua",
        pace: {
            mode: "presenter",
            active: "SsIibypcSLJGwVOgO7eCf",
            state: "idle",
            counter: 1,
            scope: "public",
            groupId: null,
        },
        closedForVoting: false,
        slideCount: 3,
    },
    {
        createdAt: "2023-02-17T10:06:47.145Z",
        updatedAt: "2023-02-17T10:10:44.494Z",
        id: 2,
        name: "demo2",
        seriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
        voteKey: "tKiHYGEAqiZbvuopGPY3X",
        ownerId: 17,
        ownerDisplayName: "Hung Nguyen Hua",
        pace: {
            mode: "presenter",
            active: "SsIibypcSLJGwVOgO7eCf",
            state: "idle",
            counter: 1,
            scope: "public",
            groupId: null,
        },
        closedForVoting: false,
        slideCount: 3,
    },
    {
        createdAt: "2023-02-17T10:06:47.145Z",
        updatedAt: "2023-02-17T10:10:44.494Z",
        id: 3,
        name: "demo3",
        seriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
        voteKey: "tKiHYGEAqiZbvuopGPY3X",
        ownerId: 17,
        ownerDisplayName: "Hung Nguyen Hua",
        pace: {
            mode: "presenter",
            active: "SsIibypcSLJGwVOgO7eCf",
            state: "idle",
            counter: 1,
            scope: "public",
            groupId: null,
        },
        closedForVoting: false,
        slideCount: 3,
    },
    {
        createdAt: "2023-02-17T10:06:47.145Z",
        updatedAt: "2023-02-17T10:10:44.494Z",
        id: 4,
        name: "demo4",
        seriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
        voteKey: "tKiHYGEAqiZbvuopGPY3X",
        ownerId: 17,
        ownerDisplayName: "Hung Nguyen Hua",
        pace: {
            mode: "presenter",
            active: "SsIibypcSLJGwVOgO7eCf",
            state: "idle",
            counter: 1,
            scope: "public",
            groupId: null,
        },
        closedForVoting: false,
        slideCount: 3,
    },
    {
        createdAt: "2023-02-17T10:06:47.145Z",
        updatedAt: "2023-02-17T10:10:44.494Z",
        id: 5,
        name: "demo5",
        seriesId: "30230834-d0eb-4f00-a4cc-7af20fe9c53b",
        voteKey: "tKiHYGEAqiZbvuopGPY3X",
        ownerId: 17,
        ownerDisplayName: "Hung Nguyen Hua",
        pace: {
            mode: "presenter",
            active: "SsIibypcSLJGwVOgO7eCf",
            state: "idle",
            counter: 1,
            scope: "public",
            groupId: null,
        },
        closedForVoting: false,
        slideCount: 3,
    },
];

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

export default function PresentationList() {
    // states
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState<IPresentationListItem[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: COMMON_CONSTANTS.pagination.defaultPage,
        totalRecords: fakeData.length,
        rowsPerPage: COMMON_CONSTANTS.pagination.limit,
    });
    const [searchObject, setSearchObject] = useState(() => {
        return {
            page: COMMON_CONSTANTS.pagination.defaultPage,
            type: PRESENTATION_TYPE.OWNER,
            limit: COMMON_CONSTANTS.pagination.limit,
        };
    });
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
                    const pagination = res.data?.pagination;
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
    }, [searchObject.limit, searchObject.page]);

    // manage create & edit modal
    const [presentationModal, setPresentationModal] = useState({
        show: false,
    });

    // contexts
    const globalContext = useGlobalContext();

    // processing functions
    const handlePageChange = (newPage: number) => {
        setSearchObject({ ...searchObject, page: newPage });
    };

    const handlePresentationTypeChange = (newValue: SingleValue<{ label: string; value: string }>) => {
        setSearchObject({ ...searchObject, type: newValue?.value || "" });
        setPresentationType({ label: newValue?.label || "", value: newValue?.value || "" });
    };

    const openPresentationModal = () => {
        setPresentationModal({ ...presentationModal, show: true });
        globalContext.blockUI();

        setTimeout(() => globalContext.unBlockUI(), 2000);
    };

    const handleDeleteAPresentation = (identifier: string) => {
        console.log(identifier);
    };

    return (
        <DashboardPageSkeleton pageTitle="Danh sách bài trình bày">
            <>
                <Stack className="mb-3 justify-content-between align-items-center" direction="horizontal">
                    <div>
                        <Button variant="primary" onClick={openPresentationModal}>
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
    );
}
