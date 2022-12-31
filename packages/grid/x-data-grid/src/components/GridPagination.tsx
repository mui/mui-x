import * as React from 'react';
import TablePagination, {
  tablePaginationClasses,
  TablePaginationProps,
} from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridPaginationSelector } from '../hooks/features/pagination/gridPaginationSelector';

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

export const GridPagination = React.forwardRef<HTMLDivElement, Partial<TablePaginationProps>>(
  function GridPagination(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const paginationState = useGridSelector(apiRef, gridPaginationSelector);

    const lastPage = React.useMemo(
      () => Math.floor(paginationState.rowCount / (paginationState.paginationModel.pageSize || 1)),
      [paginationState.rowCount, paginationState.paginationModel],
    );

    const handlePageSizeChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const pageSize = Number(event.target.value);
        apiRef.current.setPaginationModel({ pageSize, page: paginationState.paginationModel.page });
      },
      [apiRef, paginationState.paginationModel.page],
    );

    const handlePageChange = React.useCallback<TablePaginationProps['onPageChange']>(
      (event, page) => {
        apiRef.current.setPaginationModel({
          page,
          pageSize: paginationState.paginationModel.pageSize,
        });
      },
      [apiRef, paginationState.paginationModel],
    );

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const warnedOnceMissingPageSizeInRowsPerPageOptions = React.useRef(false);
      const pageSize =
        rootProps.paginationModel?.pageSize ?? paginationState.paginationModel.pageSize;
      if (
        !warnedOnceMissingPageSizeInRowsPerPageOptions.current &&
        !rootProps.autoPageSize &&
        !rootProps.rowsPerPageOptions.includes(pageSize)
      ) {
        console.warn(
          [
            `MUI: The page size \`${pageSize}\` is not preset in the \`rowsPerPageOptions\``,
            `Add it to show the pagination select.`,
          ].join('\n'),
        );

        warnedOnceMissingPageSizeInRowsPerPageOptions.current = true;
      }
    }

    return (
      <GridPaginationRoot
        ref={ref}
        component="div"
        count={paginationState.rowCount}
        page={
          paginationState.paginationModel.page <= lastPage
            ? paginationState.paginationModel.page
            : lastPage
        }
        rowsPerPageOptions={
          rootProps.rowsPerPageOptions?.includes(paginationState.paginationModel.pageSize)
            ? rootProps.rowsPerPageOptions
            : []
        }
        rowsPerPage={paginationState.paginationModel.pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        {...apiRef.current.getLocaleText('MuiTablePagination')}
        {...props}
      />
    );
  },
);
