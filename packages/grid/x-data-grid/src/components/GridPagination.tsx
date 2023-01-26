import * as React from 'react';
import TablePagination, {
  tablePaginationClasses,
  TablePaginationProps,
} from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { gridFilteredTopLevelRowCountSelector } from '../hooks/features/filter';

import { gridPaginationModelSelector } from '../hooks/features/pagination/gridPaginationSelector';

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
    const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
    const visibleTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);

    const rowCount = React.useMemo(
      () => rootProps.rowCount ?? visibleTopLevelRowCount ?? 0,
      [rootProps.rowCount, visibleTopLevelRowCount],
    );

    const lastPage = React.useMemo(
      () => Math.floor(rowCount / (paginationModel.pageSize || 1)),
      [rowCount, paginationModel.pageSize],
    );

    const handlePageSizeChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const pageSize = Number(event.target.value);
        apiRef.current.setPageSize(pageSize);
      },
      [apiRef],
    );

    const handlePageChange = React.useCallback<TablePaginationProps['onPageChange']>(
      (_, page) => {
        apiRef.current.setPage(page);
      },
      [apiRef],
    );

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const warnedOnceMissingInPageSizeOptions = React.useRef(false);

      if (
        !warnedOnceMissingInPageSizeOptions.current &&
        !rootProps.autoPageSize &&
        !rootProps.pageSizeOptions.includes(paginationModel.pageSize)
      ) {
        console.warn(
          [
            `MUI: The page size \`${paginationModel.pageSize}\` is not preset in the \`pageSizeOptions\``,
            `Add it to show the pagination select.`,
          ].join('\n'),
        );

        warnedOnceMissingInPageSizeOptions.current = true;
      }
    }

    return (
      <GridPaginationRoot
        ref={ref}
        component="div"
        count={rowCount}
        page={paginationModel.page <= lastPage ? paginationModel.page : lastPage}
        rowsPerPageOptions={
          rootProps.pageSizeOptions?.includes(paginationModel.pageSize)
            ? rootProps.pageSizeOptions
            : []
        }
        rowsPerPage={paginationModel.pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        {...apiRef.current.getLocaleText('MuiTablePagination')}
        {...props}
      />
    );
  },
);
