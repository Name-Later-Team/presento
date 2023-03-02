import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "react-bootstrap";

export interface ICustomPaginationProps {
    currentPage: number;
    totalRecords: number;
    rowsPerPage: number;

    pageChange: (newPage: number) => void | undefined;
}

export function CustomPagination(props: ICustomPaginationProps) {
    const { currentPage, totalRecords, rowsPerPage, pageChange } = props;

    const totalPages = rowsPerPage !== 0 ? Math.ceil(totalRecords / rowsPerPage) : 0;
    const pageList = getVisiblePageList(currentPage, totalPages);

    const onPageChange = (value: number) => {
        if (!pageChange || value === currentPage || value < 1 || value > totalPages) {
            return;
        }
        pageChange(value);
    };

    return (
        <Pagination className="mb-0">
            <Pagination.First title="Về trang đầu" onClick={() => onPageChange(1)} />
            <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} />

            {pageList[0] > 1 && (
                <Pagination.Item disabled>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </Pagination.Item>
            )}

            {pageList.map((page) => (
                <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
                    {page}
                </Pagination.Item>
            ))}

            {pageList[pageList.length - 1] !== totalPages && (
                <Pagination.Item disabled>
                    <FontAwesomeIcon icon={faEllipsisH} />
                </Pagination.Item>
            )}

            <Pagination.Next onClick={() => onPageChange(currentPage + 1)} />
            <Pagination.Last title="Về trang cuối" onClick={() => onPageChange(totalPages)} />
        </Pagination>
    );
}

/**
 *
 * @param currentPage current active page number
 * @param totalPages
 * @returns list of page number that will be visible to the user
 */
function getVisiblePageList(currentPage: number, totalPages: number): number[] {
    if (currentPage === 0) {
        return [0];
    }

    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pageStart = 1; // Default start page
    if (currentPage > 3 && currentPage <= totalPages - 2) {
        pageStart = currentPage - 2;
    }

    if (currentPage > totalPages - 2) {
        pageStart = totalPages - 4;
    }

    return Array.from({ length: 5 }, (_, i) => pageStart + i);
}
