import { TablePagination } from '@material-ui/core';
import React, { useCallback } from 'react';

export interface PaginationComponentProps {
  pageCount: number;
  setPage: (pageCount: number) => void;
  setPageSize: (pageSize: number) => void;
  currentPage: number;
  rowCount: number;
  pageSize: number;
}

export const Pagination: React.FC<PaginationComponentProps> = ({
  setPage,
  setPageSize,
  pageSize,
  rowCount,
  currentPage,
}) => {
  const onPageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newPageSize = Number(event.target.value);
      setPageSize(newPageSize);
    },
    [setPageSize],
  );

  const onPageChange = useCallback(
    (e: any, page: number) => {
      setPage(page + 1);
    },
    [setPage],
  );

  return (
    <TablePagination
      component="div"
      count={rowCount}
      page={currentPage - 1}
      onChangePage={onPageChange}
      rowsPerPage={pageSize}
      onChangeRowsPerPage={onPageSizeChange}
    />
  );
};
