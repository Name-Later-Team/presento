import { faEdit, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Table } from "react-bootstrap";

import moment from "moment";
import { Link } from "react-router-dom";
import { FontAwesomeIconToggle } from "../../../../../../../common/components/custom-dropdown/icon-toggle";
moment.locale("vi");

interface IPresentationListTableProps {
    dataSource: any[];
    pagination: {
        currentPage: number;
        totalRecords: number;
        rowsPerPage: number;
    };
}

export default function PresentationListTable(props: IPresentationListTableProps) {
    const { dataSource, pagination } = props;

    const mappedDataSource = dataSource.sort((left, right) => {
        const leftMoment = moment((left as any).updatedAt);
        const rightMoment = moment((right as any).updatedAt);
        return rightMoment.diff(leftMoment);
    });

    return (
        <>
            <Table bordered striped responsive hover>
                <thead>
                    <tr>
                        <th style={{ minWidth: "50px", width: "50px" }}>STT</th>
                        <th style={{ minWidth: "200px" }}>Tên</th>
                        <th style={{ minWidth: "200px", width: "250px" }}>Người tạo</th>
                        <th style={{ minWidth: "200px", width: "200px" }}>Ngày sửa gần nhất</th>
                        <th style={{ minWidth: "200px", width: "200px" }}>Ngày tạo</th>
                        <th style={{ minWidth: "150px", width: "150px" }}>Hành động</th>
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
