import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function StickyColumnHeader() {
  const { data: commodityData } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  const { data: employeeData } = useDemoData({
    dataSet: 'Employee',
    rowLength: 20,
    maxColumns: 20,
  });

  return (
    <Box sx={{ width: '100%', height: 350, overflow: 'auto' }}>
      <Typography variant="h6" my={1}>
        Commodities
      </Typography>
      <DataGrid
        {...commodityData}
        autoHeight
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        sx={(theme) => ({
          [`.${gridClasses.main}`]: {
            overflow: 'unset',
          },
          [`.${gridClasses.columnHeaders}`]: {
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
          },
        })}
      />
      <Typography variant="h6" my={1}>
        Employees
      </Typography>
      <DataGrid
        {...employeeData}
        autoHeight
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={(theme) => ({
          [`.${gridClasses.main}`]: {
            overflow: 'unset',
          },
          [`.${gridClasses.columnHeaders}`]: {
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
          },
        })}
      />
    </Box>
  );
}
