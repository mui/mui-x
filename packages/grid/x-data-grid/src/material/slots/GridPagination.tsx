import * as React from 'react';
import TablePagination, {
  tablePaginationClasses,
  TablePaginationProps,
} from '@mui/material/TablePagination';
import { styled } from '@mui/system';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { GridSlotsComponentsProps } from '../../models';

const GridPaginationRoot = styled(TablePagination)(({ theme }) => ({
  [`& .${tablePaginationClasses.selectLabel}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  [`& .${tablePaginationClasses.input}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline-flex',
    },
  },
})) as typeof TablePagination;

export const GridPagination = (props: NonNullable<GridSlotsComponentsProps['pagination']>) => {
  const apiRef = useGridApiContext();
  const { onPageChange, onPageSizeChange, rowsPerPageOptions, page, pageSize, rowCount, ...other } =
    props;

  const handlePageSizeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onPageSizeChange(Number(event.target.value));
    },
    [onPageSizeChange],
  );

  const handlePageChange = React.useCallback<TablePaginationProps['onPageChange']>(
    (event, newPage) => onPageChange(newPage),
    [onPageChange],
  );

  const lastPage = React.useMemo(
    () => Math.floor(rowCount / (pageSize || 1)),
    [rowCount, pageSize],
  );

  return (
    <GridPaginationRoot
      component="div"
      count={rowCount}
      page={page <= lastPage ? page : lastPage}
      rowsPerPageOptions={rowsPerPageOptions}
      rowsPerPage={pageSize}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePageSizeChange}
      {...apiRef.current.getLocaleText('MuiTablePagination')}
      {...other}
    />
  );
};
