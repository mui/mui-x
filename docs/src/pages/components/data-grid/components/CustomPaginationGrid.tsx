import * as React from 'react';
import { makeStyles } from '@mui/styles';
import { DataGrid, useGridApiContext, useGridState } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Pagination from '@mui/material/Pagination';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

function CustomPagination() {
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);
  const classes = useStyles();

  return (
    <Pagination
      className={classes.root}
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

export default function CustomPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pagination
        pageSize={5}
        rowsPerPageOptions={[5]}
        components={{
          Pagination: CustomPagination,
        }}
        {...data}
      />
    </div>
  );
}
