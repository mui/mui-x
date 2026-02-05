import * as React from 'react';
import {
  DataGridPremium,
  type GridColDef,
  type GridDataSource,
  type GridGetRowsParams,
  type GridGetRowsResponse,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { Box, Typography } from '@mui/material';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  startDate: string;
  projects: number;
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
  {
    field: 'salary',
    headerName: 'Salary',
    width: 120,
    type: 'number',
    valueFormatter: (value) => `$${value?.toLocaleString()}`,
  },
  { field: 'startDate', headerName: 'Start Date', width: 130 },
  {
    field: 'projects',
    headerName: 'Projects',
    width: 120,
    type: 'number',
  },
];

function EmployeeDataGrid() {
  const apiRef = useGridApiRef();

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

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['department', 'role'],
      },
      aggregation: {
        model: {
          salary: 'sum',
          projects: 'sum',
        },
      },
    },
  });

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        MUI X Data Grid Premium - Aggregation & Row Grouping
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This example demonstrates row grouping by department and role, with aggregation functions
        applied to salary (sum) and projects (sum). Try expanding/collapsing groups to see
        aggregated values.
      </Typography>

      <DataGridPremium
        apiRef={apiRef}
        columns={columns}
        dataSource={dataSource}
        initialState={initialState}
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        getAggregationPosition={(groupNode) => (groupNode.depth === -1 ? 'footer' : 'inline')}
      />
    </Box>
  );
}

export default EmployeeDataGrid;
