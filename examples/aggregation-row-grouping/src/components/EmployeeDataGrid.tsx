import * as React from 'react';
import {
  DataGridPremium,
  type GridColDef,
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

const EMPLOYEE_DATA: Employee[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 75000,
    startDate: '2023-01-15',
    projects: 5,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 65000,
    startDate: '2023-02-20',
    projects: 3,
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Manager',
    department: 'Product',
    salary: 85000,
    startDate: '2022-11-10',
    projects: 8,
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 80000,
    startDate: '2023-03-05',
    projects: 6,
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 70000,
    startDate: '2023-04-12',
    projects: 4,
  },
  {
    id: 6,
    name: 'Diana Davis',
    email: 'diana@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 68000,
    startDate: '2023-01-30',
    projects: 2,
  },
  {
    id: 7,
    name: 'Eve Miller',
    email: 'eve@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 82000,
    startDate: '2022-12-18',
    projects: 7,
  },
  {
    id: 8,
    name: 'Frank Garcia',
    email: 'frank@example.com',
    role: 'Manager',
    department: 'Sales',
    salary: 90000,
    startDate: '2022-09-25',
    projects: 10,
  },
  {
    id: 9,
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 72000,
    startDate: '2023-05-08',
    projects: 5,
  },
  {
    id: 10,
    name: 'Henry Taylor',
    email: 'henry@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 78000,
    startDate: '2023-06-14',
    projects: 4,
  },
  {
    id: 11,
    name: 'Ivy Chen',
    email: 'ivy@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 76000,
    startDate: '2023-07-22',
    projects: 6,
  },
  {
    id: 12,
    name: 'Jack Anderson',
    email: 'jack@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 67000,
    startDate: '2023-08-15',
    projects: 3,
  },
  {
    id: 13,
    name: 'Kate Martinez',
    email: 'kate@example.com',
    role: 'Manager',
    department: 'Marketing',
    salary: 88000,
    startDate: '2023-09-03',
    projects: 9,
  },
  {
    id: 14,
    name: 'Liam Thompson',
    email: 'liam@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 71000,
    startDate: '2023-10-11',
    projects: 4,
  },
  {
    id: 15,
    name: 'Maya Rodriguez',
    email: 'maya@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 79000,
    startDate: '2023-11-28',
    projects: 5,
  },
  {
    id: 16,
    name: 'Noah White',
    email: 'noah@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 66000,
    startDate: '2023-12-05',
    projects: 2,
  },
  {
    id: 17,
    name: 'Olivia Harris',
    email: 'olivia@example.com',
    role: 'Manager',
    department: 'HR',
    salary: 87000,
    startDate: '2024-01-14',
    projects: 7,
  },
  {
    id: 18,
    name: 'Paul Clark',
    email: 'paul@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 73000,
    startDate: '2024-02-20',
    projects: 6,
  },
  {
    id: 19,
    name: 'Quinn Lewis',
    email: 'quinn@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 81000,
    startDate: '2024-03-08',
    projects: 8,
  },
  {
    id: 20,
    name: 'Ruby Hall',
    email: 'ruby@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 69000,
    startDate: '2024-04-12',
    projects: 4,
  },
  {
    id: 21,
    name: 'Sam Young',
    email: 'sam@example.com',
    role: 'Manager',
    department: 'Finance',
    salary: 92000,
    startDate: '2024-05-18',
    projects: 11,
  },
  {
    id: 22,
    name: 'Tara King',
    email: 'tara@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 74000,
    startDate: '2024-06-25',
    projects: 5,
  },
  {
    id: 23,
    name: 'Uma Patel',
    email: 'uma@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 77000,
    startDate: '2024-07-30',
    projects: 4,
  },
  {
    id: 24,
    name: 'Victor Moore',
    email: 'victor@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 64000,
    startDate: '2024-08-14',
    projects: 3,
  },
  {
    id: 25,
    name: 'Wendy Scott',
    email: 'wendy@example.com',
    role: 'Manager',
    department: 'Operations',
    salary: 86000,
    startDate: '2024-09-22',
    projects: 8,
  },
  {
    id: 26,
    name: 'Xander Green',
    email: 'xander@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 75000,
    startDate: '2024-10-05',
    projects: 6,
  },
  {
    id: 27,
    name: 'Yara Adams',
    email: 'yara@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 80000,
    startDate: '2024-11-12',
    projects: 7,
  },
  {
    id: 28,
    name: 'Zane Baker',
    email: 'zane@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 67000,
    startDate: '2024-12-18',
    projects: 2,
  },
  {
    id: 29,
    name: 'Aria Nelson',
    email: 'aria@example.com',
    role: 'Manager',
    department: 'Legal',
    salary: 95000,
    startDate: '2025-01-25',
    projects: 6,
  },
  {
    id: 30,
    name: 'Blake Carter',
    email: 'blake@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 72000,
    startDate: '2025-02-28',
    projects: 5,
  },
  {
    id: 31,
    name: 'Cora Mitchell',
    email: 'cora@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 78000,
    startDate: '2025-03-15',
    projects: 5,
  },
  {
    id: 32,
    name: 'Dexter Perez',
    email: 'dexter@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 65000,
    startDate: '2025-04-20',
    projects: 3,
  },
  {
    id: 33,
    name: 'Echo Roberts',
    email: 'echo@example.com',
    role: 'Manager',
    department: 'Sales',
    salary: 89000,
    startDate: '2025-05-10',
    projects: 9,
  },
  {
    id: 34,
    name: 'Finn Turner',
    email: 'finn@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 71000,
    startDate: '2025-06-18',
    projects: 4,
  },
  {
    id: 35,
    name: 'Gemma Phillips',
    email: 'gemma@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 82000,
    startDate: '2025-07-25',
    projects: 6,
  },
  {
    id: 36,
    name: 'Hawk Campbell',
    email: 'hawk@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 68000,
    startDate: '2025-08-30',
    projects: 4,
  },
  {
    id: 37,
    name: 'Indigo Parker',
    email: 'indigo@example.com',
    role: 'Manager',
    department: 'Product',
    salary: 87000,
    startDate: '2025-09-05',
    projects: 10,
  },
  {
    id: 38,
    name: 'Jasper Evans',
    email: 'jasper@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 73000,
    startDate: '2025-10-12',
    projects: 5,
  },
  {
    id: 39,
    name: 'Kai Edwards',
    email: 'kai@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 79000,
    startDate: '2025-11-20',
    projects: 7,
  },
  {
    id: 40,
    name: 'Luna Collins',
    email: 'luna@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 66000,
    startDate: '2025-12-28',
    projects: 3,
  },
];

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
        rows={EMPLOYEE_DATA}
        columns={columns}
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
