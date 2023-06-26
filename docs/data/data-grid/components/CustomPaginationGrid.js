import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import MuiPagination from '@mui/material/Pagination';

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

export default function CustomPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        pagination
        slots={{
          pagination: CustomPagination,
        }}
        {...data}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 25 } },
        }}
      />
    </Box>
  );
}
