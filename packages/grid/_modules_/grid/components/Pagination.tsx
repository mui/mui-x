import * as React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useGridSelector } from '../hooks/features/core/useGridSelector';
import { paginationSelector } from '../hooks/features/pagination/paginationSelector';
import { optionsSelector } from '../hooks/utils/useOptionsProp';
import { ApiContext } from './api-context';

// Used to hide the drop down select from the TablePaginagion
const useStyles = makeStyles((theme: Theme) => ({
  caption: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    '& ~ &': {
      display: 'block',
    },
  },
  input: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
}));

export function Pagination() {
  const classes = useStyles();
  const apiRef = React.useContext(ApiContext);
  const paginationState = useGridSelector(apiRef, paginationSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const onPageSizeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const newPageSize = Number(event.target.value);
      apiRef!.current!.setPageSize(newPageSize);
    },
    [apiRef],
  );

  const onPageChange = React.useCallback(
    (event: any, page: number) => {
      apiRef!.current!.setPage(page + 1);
    },
    [apiRef],
  );

  return (
    <TablePagination
      classes={classes}
      component="div"
      count={paginationState.rowCount}
      page={paginationState.page - 1}
      onChangePage={onPageChange}
      rowsPerPageOptions={
        options.rowsPerPageOptions &&
        options.rowsPerPageOptions.indexOf(paginationState.pageSize) > -1
          ? options.rowsPerPageOptions
          : []
      }
      rowsPerPage={paginationState.pageSize}
      onChangeRowsPerPage={onPageSizeChange}
      labelRowsPerPage={apiRef!.current.getLocaleText('footerPaginationRowsPerPage')}
    />
  );
}
