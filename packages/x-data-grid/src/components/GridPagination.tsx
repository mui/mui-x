import * as React from 'react';
import { styled } from '@mui/material/styles';
import TablePagination, {
  tablePaginationClasses,
  TablePaginationProps,
} from '@mui/material/TablePagination';
// import TablePagination, { tablePaginationClasses, TablePaginationProps } from './tablePagination';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  gridPaginationModelSelector,
  gridPaginationRowCountSelector,
  gridPageCountSelector,
} from '../hooks/features/pagination/gridPaginationSelector';

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

const getLabelDisplayedRows: (
  estimatedRowCount?: number,
) => TablePaginationProps['labelDisplayedRows'] =
  (estimatedRowCount?: number) =>
  ({ from, to, count }: { from: number; to: number; count: number }) => {
    if (!estimatedRowCount) {
      return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
    }
    return `${from}–${to} of ${count !== -1 ? count : `more than ${estimatedRowCount > to ? estimatedRowCount : to}`}`;
  };

// A mutable version of a readonly array.

type MutableArray<A> = A extends readonly (infer T)[] ? T[] : never;

export const GridPagination = React.forwardRef<unknown, Partial<TablePaginationProps>>(
  function GridPagination(props, ref) {
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
    const rowCount = useGridSelector(apiRef, gridPaginationRowCountSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const { paginationMode, loading, estimatedRowCount } = rootProps;

    const computedProps: Partial<TablePaginationProps> = React.useMemo(() => {
      if (paginationMode === 'server' && loading) {
        return {
          backIconButtonProps: { disabled: true },
          nextIconButtonProps: { disabled: true },
        };
      }

      return {};
    }, [loading, paginationMode]);

    const lastPage = React.useMemo(() => Math.max(0, pageCount - 1), [pageCount]);

    const computedPage = React.useMemo(() => {
      if (rowCount === -1) {
        return paginationModel.page;
      }
      return paginationModel.page <= lastPage ? paginationModel.page : lastPage;
    }, [lastPage, paginationModel.page, rowCount]);

    const labelDisplayedRows = React.useMemo(
      () => getLabelDisplayedRows(estimatedRowCount),
      [estimatedRowCount],
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

    const isPageSizeIncludedInPageSizeOptions = (pageSize: number) => {
      for (let i = 0; i < rootProps.pageSizeOptions.length; i += 1) {
        const option = rootProps.pageSizeOptions[i];
        if (typeof option === 'number') {
          if (option === pageSize) {
            return true;
          }
        } else if (option.value === pageSize) {
          return true;
        }
      }
      return false;
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const warnedOnceMissingInPageSizeOptions = React.useRef(false);

      const pageSize = rootProps.paginationModel?.pageSize ?? paginationModel.pageSize;
      if (
        !warnedOnceMissingInPageSizeOptions.current &&
        !rootProps.autoPageSize &&
        !isPageSizeIncludedInPageSizeOptions(pageSize)
      ) {
        console.warn(
          [
            `MUI X: The page size \`${paginationModel.pageSize}\` is not preset in the \`pageSizeOptions\`.`,
            `Add it to show the pagination select.`,
          ].join('\n'),
        );

        warnedOnceMissingInPageSizeOptions.current = true;
      }
    }

    const pageSizeOptions = isPageSizeIncludedInPageSizeOptions(paginationModel.pageSize)
      ? rootProps.pageSizeOptions
      : [];

    return (
      <GridPaginationRoot
        ref={ref}
        component="div"
        count={rowCount}
        estimatedCount={estimatedRowCount}
        page={computedPage}
        // TODO: Remove the cast once the type is fixed in Material UI and that the min Material UI version
        // for x-data-grid is past the fix.
        // Note that Material UI will not mutate the array, so this is safe.
        rowsPerPageOptions={pageSizeOptions as MutableArray<typeof pageSizeOptions>}
        rowsPerPage={paginationModel.pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
        {...computedProps}
        {...apiRef.current.getLocaleText('MuiTablePagination')}
        {...props}
        labelDisplayedRows={labelDisplayedRows}
      />
    );
  },
);
