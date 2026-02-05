---
title: Tutorial - Data Grid with Aggregation and Row Grouping
description: Learn how to use aggregation functions and row grouping in the Data Grid Premium to analyze and organize your data.
---

# Build a Data Grid with Aggregation and Row Grouping

## Overview

This tutorial walks you through building a client-side Data Grid that demonstrates aggregation functions and row grouping using the MUI X Data Grid Premium.
You will define data locally and use the grid to group rows by column values and apply aggregation functions (such as sum, average, min, max) to analyze data within those groups.

:::success
If you'd rather skip the tutorial entirely, you can check out [the complete app code on GitHub](https://github.com/mui/mui-x/tree/master/examples/aggregation-row-grouping/).
:::

## Prerequisites

- Basic React knowledge
- Understanding of TypeScript interfaces

### Relevant documentation

The docs listed below may be useful if you're new to the MUI X Data Grid:

- [Row grouping](/x/react-data-grid/row-grouping/)
- [Aggregation](/x/react-data-grid/aggregation/)
- [Column definition](/x/react-data-grid/column-definition/)
- [Pagination](/x/react-data-grid/pagination/)

## Part one: App setup

In part one, you'll set up a React app with Vite and install the dependencies you need for the Data Grid Premium.

### 1. Create the project

Create a new directory and scaffold a React app with Vite in TypeScript:

```bash
mkdir aggregation-row-grouping &&
cd aggregation-row-grouping &&
pnpm create vite@latest . -- --template react-ts &&
pnpm install
```

:::success
This tutorial uses pnpm, but all MUI libraries are also compatible with npm and yarn.
See the [Material UI installation page](https://mui.com/material-ui/getting-started/installation/) for more details.
:::

### 2. Install dependencies

Install Material UI and MUI X Data Grid Premium:

```bash
pnpm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid-premium @fontsource/roboto
```

### 3. Set up the app shell

Create a `components` directory and add a placeholder for the grid.
Create `src/components/EmployeeDataGrid.tsx`:

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  type GridColDef,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import { Box, Typography } from '@mui/material';

const EmployeeDataGrid = () => {
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        MUI X Data Grid Premium - Aggregation & Row Grouping
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Row grouping by department and role, with aggregation (sum) on salary and
        projects.
      </Typography>
    </Box>
  );
};

export default EmployeeDataGrid;
```

Update `src/App.tsx`:

```tsx
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import EmployeeDataGrid from './components/EmployeeDataGrid';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmployeeDataGrid />
      </Container>
    </React.Fragment>
  );
}

export default App;
```

Replace the contents of `src/main.tsx` with:

```tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 4. Run the app

```bash
pnpm dev
```

The app runs on `http://localhost:5173`.

## Part two: Data Grid with aggregation and row grouping

In this section you'll add local data, column definitions, row grouping, and aggregation to `EmployeeDataGrid.tsx`.

### 5. Define the data structure and rows

Define an `Employee` interface and a local array of rows.
Add this below the imports in `EmployeeDataGrid.tsx`:

```tsx
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
```

**What's happening here:**

- `Employee` describes one row in the grid; `projects` and `salary` are used for aggregation.
- `EMPLOYEE_DATA` is the in-memory dataset. The grid will group and aggregate over these rows on the client.

### 6. Define the grid columns

Add column definitions that match your data:

```tsx
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
  { field: 'projects', headerName: 'Projects', width: 120, type: 'number' },
];
```

**What's happening here:**

- `field` matches properties on `Employee`.
- `type: 'number'` on `salary` and `projects` allows aggregation.
- `valueFormatter` formats salary as currency.

### 7. Configure row grouping and aggregation

Use `useGridApiRef` and `useKeepGroupedColumnsHidden` to set initial row grouping and aggregation:

```tsx
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
    // ... JSX next
  );
}
```

**What's happening here:**

- `apiRef` is used by `useKeepGroupedColumnsHidden` to hide grouped columns from the column panel.
- `rowGrouping.model` groups rows by `department`, then by `role` inside each department.
- `aggregation.model` applies `sum` to `salary` and `projects` for each group.

### 8. Configure aggregation position

Control where aggregated values appear:

```tsx
getAggregationPosition={(groupNode) =>
  groupNode.depth === -1 ? 'footer' : 'inline'
}
```

**What's happening here:**

- Root level (`depth === -1`): aggregates in a footer row.
- Nested groups: aggregates inline with the group header.

### 9. Render the Data Grid Premium

Render the grid with `rows`, `columns`, and the options you defined:

```tsx
<DataGridPremium
  apiRef={apiRef}
  rows={EMPLOYEE_DATA}
  columns={columns}
  initialState={initialState}
  pagination
  pageSizeOptions={[10, 25, 50, 100]}
  disableRowSelectionOnClick
  getAggregationPosition={(groupNode) =>
    groupNode.depth === -1 ? 'footer' : 'inline'
  }
/>
```

**What's happening here:**

- `DataGridPremium` is required for row grouping and aggregation.
- `rows={EMPLOYEE_DATA}` passes your local data.
- `initialState` holds the grouping and aggregation config.
- `getAggregationPosition` sets where aggregates are shown (footer vs inline).

### 10. Complete component

With the `EMPLOYEE_DATA` and `columns` from steps 5 and 6 in place, the rest of `EmployeeDataGrid.tsx` is:

```tsx
function EmployeeDataGrid() {
  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: { model: ['department', 'role'] },
      aggregation: { model: { salary: 'sum', projects: 'sum' } },
    },
  });

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        MUI X Data Grid Premium - Aggregation & Row Grouping
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Row grouping by department and role, with aggregation (sum) on salary and
        projects.
      </Typography>

      <DataGridPremium
        apiRef={apiRef}
        rows={EMPLOYEE_DATA}
        columns={columns}
        initialState={initialState}
        pagination
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        getAggregationPosition={(groupNode) =>
          groupNode.depth === -1 ? 'footer' : 'inline'
        }
      />
    </Box>
  );
}

export default EmployeeDataGrid;
```

You should see employee data grouped by department and role, with sum of salary and projects per group. Expand and collapse groups to explore the hierarchy.

## Understanding aggregation and row grouping

### Row grouping

Rows are grouped by column values. Here we use:

1. **Department** – top-level groups
2. **Role** – subgroups inside each department

You can expand or collapse groups to see detail rows.

### Aggregation functions

Aggregations summarize values in a group. Common functions:

- `sum` – total of values
- `avg` – average
- `min` / `max` – minimum or maximum
- `size` – number of rows

This tutorial uses `sum` for salary and projects.

### Aggregation position

`getAggregationPosition` controls where aggregates appear:

- `'footer'` – footer row (e.g. root level)
- `'inline'` – next to the group header (e.g. nested groups)
- `null` – hide aggregates for that level

## Learn more

- [Row grouping](/x/react-data-grid/row-grouping/)
- [Aggregation](/x/react-data-grid/aggregation/)
- [Data Grid Premium](/x/react-data-grid/getting-started/#premium-features)
