import * as React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { gridPaginationSelector } from '../hooks/features/pagination/gridPaginationSelector';
import { optionsSelector } from '../hooks/utils/optionsSelector';
import { useGridApiContext } from '../hooks/root/useGridApiContext';
import { getMuiVersion, createTheme } from '../utils';
import { GridRootPropsContext } from '../context/GridRootPropsContext';
import { DEFAULT_PAGE_SIZE } from '../hooks/features/pagination/gridPaginationState';

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
  const rootProps = React.useContext(GridRootPropsContext)!;
  const paginationState = useGridSelector(apiRef, gridPaginationSelector);

  const lastPage = React.useMemo(
    () => Math.floor(paginationState.rowCount / (paginationState.pageSize || 1)),
    [paginationState.rowCount, paginationState.pageSize],
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
    if (getMuiVersion() !== 'v4') {
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

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const warnedOnceMissingPageSizeInRowsPerPageOptions = React.useRef(false);
    if (
      !warnedOnceMissingPageSizeInRowsPerPageOptions.current &&
      !rootProps.rowsPerPageOptions!.includes(rootProps.pageSize ?? DEFAULT_PAGE_SIZE)
    ) {
      console.warn(
        [
          `Material-UI: The page size \`${
            rootProps.pageSize ?? DEFAULT_PAGE_SIZE
          }\` is not preset in the \`rowsPerPageOptions\``,
          `Add it to show the pagination select.`,
        ].join('\n'),
      );
      warnedOnceMissingPageSizeInRowsPerPageOptions.current = true;
    }
  }

  return (
    // @ts-ignore TODO remove once upgraded v4 support is dropped
    <TablePagination
      ref={ref}
      classes={{
        ...(getMuiVersion() === 'v5'
          ? { selectLabel: classes.selectLabel }
          : { caption: classes.caption }),
        input: classes.input,
      }}
      component="div"
      count={paginationState.rowCount}
      page={paginationState.page <= lastPage ? paginationState.page : lastPage}
      rowsPerPageOptions={
        options.rowsPerPageOptions?.includes(paginationState.pageSize)
          ? options.rowsPerPageOptions
          : []
      }
      rowsPerPage={paginationState.pageSize}
      {...apiRef!.current.getLocaleText('MuiTablePagination')}
      {...getPaginationChangeHandlers()}
      {...props}
    />
  );
});
