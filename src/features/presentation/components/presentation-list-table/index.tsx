import { faEdit, faShareAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Table } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import { FontAwesomeIconToggle } from "../../../../common/components/custom-dropdown/icon-toggle";
import { AlertBuilder } from "../../../../common/components/alert";
moment.locale("vi");

interface IPresentationListTableProps {
    dataSource: any[];
    pagination: {
        currentPage: number;
        totalRecords: number;
        rowsPerPage: number;
    };
    action?: {
        handleDeletePresentation: (id: string) => {};
    };
}

export default function PresentationListTable(props: IPresentationListTableProps) {
    const { dataSource, pagination, action } = props;

    // display the newest record first
    const mappedDataSource = dataSource.sort((left, right) => {
        const leftMoment = moment((left as any).updatedAt);
        const rightMoment = moment((right as any).updatedAt);
        return rightMoment.diff(leftMoment);
    });

    const handleDeletePresentation = (id: string) => {
        action && action.handleDeletePresentation(id);
    };

    const openDeleteConfirm = (id: string) => {
        new AlertBuilder()
            .setAlertType("warning")
            .setTitle("Xóa bài trình bày")
            .setText("Sau khi xóa bài trình bày, mọi dữ liệu sẽ không thể được phục hồi")
            .setOnConfirm(() => {
                handleDeletePresentation(id);
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
                    {mappedDataSource.map((presentation: any, index) => {
                        return (
                            <tr key={presentation?.id}>
                                <td>{index + 1 + (pagination.currentPage - 1) * pagination.rowsPerPage}</td>
                                <td>
                                    <Link to={`./${presentation?.seriesId}`}>{presentation?.name}</Link>
                                </td>
                                <td>{presentation?.ownerDisplayName}</td>
                                <td>{moment(presentation?.updatedAt).format("DD/MM/YYYY HH:mm:ss")}</td>
                                <td>{moment(presentation?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</td>
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
                                            <Dropdown.Item href="#" onClick={() => {}}>
                                                <FontAwesomeIcon className="me-1" icon={faEdit} /> Sửa tên
                                            </Dropdown.Item>

                                            <Dropdown.Item href="#" onClick={() => {}}>
                                                <FontAwesomeIcon className="me-1" icon={faShareAlt} /> Chia sẻ
                                            </Dropdown.Item>

                                            <Dropdown.Divider />
                                            <Dropdown.Item
                                                href="#"
                                                onClick={() => openDeleteConfirm(presentation?.id)}
                                                className="text-danger"
                                            >
                                                <FontAwesomeIcon className="me-1" icon={faTrashAlt} /> Xóa
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>

            {mappedDataSource.length === 0 && (
                <div className="text-center py-3 border border-top-0">Không có dữ liệu phù hợp</div>
            )}
        </>
    );
}
