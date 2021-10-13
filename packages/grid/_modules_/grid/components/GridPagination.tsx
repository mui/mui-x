import * as React from 'react';
import TablePagination, { TablePaginationProps } from '@mui/material/TablePagination';
import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridPaginationSelector } from '../hooks/features/pagination/gridPaginationSelector';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

const defaultTheme = createTheme();
// Used to hide the Rows per page selector on small devices
const useStyles = makeStyles(
  (theme) => ({
    selectLabel: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    caption: {
      // input label
      '&[id]': {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      },
    },
    input: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'inline-flex',
      },
    },
  }),
  { defaultTheme },
);

export const GridPagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridPagination(props, ref) {
  const classes = useStyles();
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);

  const lastPage = React.useMemo(
    () => Math.floor(paginationState.rowCount / (paginationState.pageSize || 1)),
    [paginationState.rowCount, paginationState.pageSize],
  );

  const handlePageSizeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newPageSize = Number(event.target.value);
      apiRef.current.setPageSize(newPageSize);
    },
    [apiRef],
  );

  const handlePageChange = React.useCallback<TablePaginationProps['onPageChange']>(
    (event, page) => {
      apiRef.current.setPage(page);
    },
    [apiRef],
  );

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const warnedOnceMissingPageSizeInRowsPerPageOptions = React.useRef(false);
    if (
      !warnedOnceMissingPageSizeInRowsPerPageOptions.current &&
      !rootProps.autoPageSize &&
      !rootProps.rowsPerPageOptions.includes(rootProps.pageSize ?? paginationState.pageSize)
    ) {
      console.warn(
        [
          `MUI: The page size \`${
            rootProps.pageSize ?? paginationState.pageSize
          }\` is not preset in the \`rowsPerPageOptions\``,
          `Add it to show the pagination select.`,
        ].join('\n'),
      );

      warnedOnceMissingPageSizeInRowsPerPageOptions.current = true;
    }
  }

  return (
    <TablePagination
      ref={ref}
      classes={{
        selectLabel: classes.selectLabel,
        input: classes.input,
      }}
      component="div"
      count={paginationState.rowCount}
      page={paginationState.page <= lastPage ? paginationState.page : lastPage}
      rowsPerPageOptions={
        rootProps.rowsPerPageOptions?.includes(paginationState.pageSize)
          ? rootProps.rowsPerPageOptions
          : []
      }
      rowsPerPage={paginationState.pageSize}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePageSizeChange}
      {...apiRef.current.getLocaleText('MuiTablePagination')}
      {...props}
    />
  );
});
