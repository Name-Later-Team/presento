import { faEdit, faShareAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Table } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import { FontAwesomeIconToggle } from "../../../../common/components/custom-dropdown/icon-toggle";
import { AlertBuilder } from "../../../../common/components/alert";
import { IPresentationListItem } from "../../pages/presentation-list";
moment.locale("vi");

interface IPresentationListTableProps {
    dataSource: IPresentationListItem[];
    pagination: {
        currentPage: number;
        totalRecords: number;
        rowsPerPage: number;
    };
    action?: {
        handleDeletePresentation: (identifier: string) => void;
        handleOpenRenameModal: (record: IPresentationListItem) => void;
        handleOpenShareModal: (identifier: string) => void;
    };
}

export default function PresentationListTable(props: IPresentationListTableProps) {
    const { dataSource, pagination, action } = props;

    const handleDeletePresentation = (identifier: string) => {
        action && action.handleDeletePresentation(identifier);
    };

    const handleOpenRenameModal = (record: IPresentationListItem) => {
        action && action.handleOpenRenameModal(record);
    };

    const handleOpenShareModal = (identifier: string) => {
        action && action.handleOpenShareModal(identifier);
    };

    const openDeleteConfirm = (identifier: string) => {
        new AlertBuilder()
            .setAlertType("warning")
            .setTitle("Xóa bài trình bày")
            .setText("Sau khi xóa bài trình bày, mọi dữ liệu sẽ không thể được phục hồi")
            .setOnConfirm(() => {
                handleDeletePresentation(identifier);
            })
            .setCancelBtnText("Hủy")
            .getAlert()
            .fireAlert();
    };

    return (
        <>
            <Table bordered striped responsive hover>
                <thead>
                    <tr>
                        <th style={{ minWidth: "50px", width: "50px" }}>STT</th>
                        <th style={{ minWidth: "240px" }}>Tên bài trình bày</th>
                        <th style={{ minWidth: "200px", width: "250px" }}>Người tạo</th>
                        <th style={{ minWidth: "210px", width: "210px" }}>Ngày sửa gần nhất</th>
                        <th style={{ minWidth: "210px", width: "210px" }}>Ngày tạo</th>
                        <th style={{ minWidth: "130px", width: "130px" }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {dataSource.map((presentation, index) => {
                        return (
                            <tr key={presentation.identifier}>
                                <td>{index + 1 + (pagination.currentPage - 1) * pagination.rowsPerPage}</td>
                                <td>
                                    <Link to={`/presentation/${presentation.identifier}`}>{presentation.name}</Link>
                                </td>
                                <td>{presentation.ownerDisplayName}</td>
                                <td>{moment(presentation.updatedAt).format("DD/MM/YYYY HH:mm:ss")}</td>
                                <td>{moment(presentation.createdAt).format("DD/MM/YYYY HH:mm:ss")}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            as={FontAwesomeIconToggle}
                                            id="dropdown-custom-components"
                                        ></Dropdown.Toggle>
                                        <Dropdown.Menu
                                            style={{ margin: 0 }}
                                            renderOnMount
                                            popperConfig={{ strategy: "fixed" }}
                                        >
                                            <Dropdown.Item
                                                as="button"
                                                onClick={() => handleOpenRenameModal(presentation)}
                                            >
                                                <FontAwesomeIcon
                                                    style={{ width: "1rem" }}
                                                    className="me-2"
                                                    icon={faEdit}
                                                />
                                                Sửa tên
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                                as="button"
                                                onClick={() => handleOpenShareModal(presentation.identifier)}
                                            >
                                                <FontAwesomeIcon
                                                    style={{ width: "1rem" }}
                                                    className="me-2"
                                                    icon={faShareAlt}
                                                />
                                                Chia sẻ
                                            </Dropdown.Item>

                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                                className="text-danger"
                                                as="button"
                                                onClick={() => openDeleteConfirm(presentation.identifier)}
                                            >
                                                <FontAwesomeIcon
                                                    style={{ width: "1rem" }}
                                                    className="me-2"
                                                    icon={faTrashAlt}
                                                />
                                                Xóa
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {dataSource.length === 0 && (
                <div className="text-center py-3 border border-top-0">Không có dữ liệu phù hợp</div>
            )}
        </>
    );
}
