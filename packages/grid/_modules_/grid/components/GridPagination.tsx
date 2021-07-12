import * as React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import {
  gridPageSizeSelector,
  gridPageSelector,
} from '../hooks/features/pagination/gridPaginationSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { isMuiV5, createTheme } from '../utils';

const defaultTheme = createTheme();
// Used to hide the Rows per page selector on small devices
const useStyles = makeStyles(
  (theme: Theme) => ({
    selectLabel: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block',
      },
    },
    caption: {
      // input label
      '&[id]': {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'block',
        },
      },
    },
    input: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
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
  const pageState = useGridSelector(apiRef, gridPageSelector);
  const pageSizeState = useGridSelector(apiRef, gridPageSizeSelector);

  const lastPage = React.useMemo(
    () => Math.floor(pageState.rowCount / (pageSizeState || 1)),
    [pageState.rowCount, pageSizeState],
  );
  const options = useGridSelector(apiRef, optionsSelector);

  const handlePageSizeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newPageSize = Number(event.target.value);
      apiRef!.current!.setPageSize(newPageSize);
    },
    [apiRef],
  );

  const handlePageChange = React.useCallback(
    (event: any, page: number) => {
      apiRef!.current!.setPage(page);
    },
    [apiRef],
  );

  const getPaginationChangeHandlers = () => {
    if (isMuiV5()) {
      return {
        onPageChange: handlePageChange,
        onRowsPerPageChange: handlePageSizeChange,
      };
    }

    return {
      onChangePage: handlePageChange,
      onChangeRowsPerPage: handlePageSizeChange,
    };
  };

  return (
    // @ts-ignore TODO remove once upgraded v4 support is dropped
    <TablePagination
      ref={ref}
      classes={{
        ...(isMuiV5() ? { selectLabel: classes.selectLabel } : { caption: classes.caption }),
        input: classes.input,
      }}
      component="div"
      count={pageState.rowCount}
      page={pageState.currentPage <= lastPage ? pageState.currentPage : lastPage}
      rowsPerPageOptions={
        options.rowsPerPageOptions && options.rowsPerPageOptions.indexOf(pageSizeState) > -1
          ? options.rowsPerPageOptions
          : []
      }
      rowsPerPage={pageSizeState}
      {...apiRef!.current.getLocaleText('MuiTablePagination')}
      {...getPaginationChangeHandlers()}
      {...props}
    />
  );
});
