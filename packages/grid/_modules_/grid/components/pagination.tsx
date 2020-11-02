import * as React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core';

export interface PaginationComponentProps {
  pageCount: number;
  setPage: (pageCount: number) => void;
  setPageSize: (pageSize: number) => void;
  currentPage: number;
  rowCount: number;
  pageSize: number;
  rowsPerPageOptions?: number[];
}

// Used to hide the drop down select from the TablePaginagion
const useStyles = makeStyles({
  select: {
    display: 'none',
  },
  selectIcon: {
    display: 'none',
  },
});

export const Pagination: React.FC<PaginationComponentProps> = ({
  setPage,
  setPageSize,
  pageSize,
  rowCount,
  currentPage,
  rowsPerPageOptions,
}) => {
  const classes = useStyles();
  const onPageSizeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newPageSize = Number(event.target.value);
      setPageSize(newPageSize);
    },
    [setPageSize],
  );

  const onPageChange = React.useCallback(
    (event: any, page: number) => {
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
      rowsPerPageOptions={
        rowsPerPageOptions && rowsPerPageOptions.indexOf(pageSize) > -1 ? rowsPerPageOptions : []
      }
      rowsPerPage={pageSize}
      onChangeRowsPerPage={onPageSizeChange}
      labelRowsPerPage={''}
      classes={classes}
    />
  );
};
