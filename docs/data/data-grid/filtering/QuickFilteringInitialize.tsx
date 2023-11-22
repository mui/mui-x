import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function QuickFilteringInitialize() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <DataGrid
        {...data}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: ['ab'],
            },
          },
        }}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
