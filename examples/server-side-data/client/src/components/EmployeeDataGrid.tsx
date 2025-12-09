import * as React from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridDataSource,
  type GridGetRowsParams,
  type GridGetRowsResponse,
} from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  startDate: string;
}

interface ApiResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'department', headerName: 'Department', width: 150 },
  { field: 'salary', headerName: 'Salary', width: 120 },
  { field: 'startDate', headerName: 'Start Date', width: 130 },
];

function EmployeeDataGrid() {
  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          sortModel: JSON.stringify(params.sortModel || []),
          filterModel: JSON.stringify(params.filterModel || {}),
        });

        const response = await fetch(`http://localhost:3001/api/employees?${urlParams.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        return {
          rows: result.data,
          rowCount: result.total,
        };
      },
    }),
    [],
  );

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        MUI X Data Grid with the Data Source layer
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Server-side data with pagination, sorting, and filtering.
      </Typography>

      <DataGrid
        columns={columns}
        dataSource={dataSource}
        pagination
        pageSizeOptions={[5, 10, 25, 100]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default EmployeeDataGrid;
