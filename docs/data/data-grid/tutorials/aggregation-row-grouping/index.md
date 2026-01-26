---
title: Tutorial - Data Grid with Aggregation and Row Grouping
description: Learn how to use aggregation functions and row grouping in the Data Grid Premium to analyze and organize your data.
---

# Build a Data Grid with Aggregation and Row Grouping

## Overview

This tutorial walks you through building a Data Grid that demonstrates aggregation functions and row grouping using the MUI X Data Grid Premium.
The primary purpose is to show how to group rows by column values and apply aggregation functions (such as sum, average, min, max) to analyze data within those groups.

:::success
If you'd rather skip the tutorial entirely, you can check out [the complete app code on GitHub](https://github.com/mui/mui-x/tree/master/examples/aggregation-row-grouping/).
:::

## Prerequisites

- Basic React knowledge
- Understanding of TypeScript interfaces
- Familiarity with async/await and fetch APIs

### Relevant documentation

The docs listed below may be useful if you're new to the MUI X Data Grid:

- [Row grouping](/x/react-data-grid/row-grouping/)
- [Aggregation](/x/react-data-grid/aggregation/)
- [Column definition](/x/react-data-grid/column-definition/)
- [Pagination](/x/react-data-grid/pagination/)

## Part one: App setup

In part one, you'll set up the basic scaffolding for a full-stack React app using Vite on the front end and Express.js for the back end.

### 1. Create the project structure

Create a new directory and set up the folder structure:

```bash
mkdir aggregation-row-grouping &&
cd aggregation-row-grouping &&
mkdir client server
```

### 2. Initialize the server

Navigate to the server directory and initialize:

```bash
cd server &&
pnpm init
```

Install server dependencies:

```bash
pnpm install express cors &&
pnpm install --save-dev typescript @types/express @types/node tsx
```

:::success
This tutorial uses pnpm, but all MUI libraries are also compatible with npm and yarn.
See the [Material UI installation page](https://mui.com/material-ui/getting-started/installation/) for more details.
:::

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3. Initialize the client

Navigate to the client directory and create a React app with Vite in TypeScript:

```bash
cd ../client &&
pnpm create vite@latest . -- --template react-ts &&
pnpm install
```

Install Material UI and MUI X dependencies:

```bash
pnpm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid-premium @fontsource/roboto
```

### 4. Set up the server code

Create `server/src/index.ts` and add the following code:

```ts
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data - simulating a database with data suitable for grouping and aggregation
const dummyData = [
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

// API Routes
app.get('/api/employees', (req, res) => {
  const { page = 0, pageSize = 40, sortModel = [], filterModel = {} } = req.query;

  let filteredData = [...dummyData];

  // Apply filtering
  if (filterModel && typeof filterModel === 'string') {
    try {
      const filters = JSON.parse(filterModel as string);

      if (filters.items && filters.items.length > 0) {
        filteredData = filteredData.filter((item) => {
          const logicOperator = filters.logicOperator || 'Or';

          if (logicOperator === 'And') {
            // All filter items must match
            return filters.items.every((filterItem: any) => {
              const value = item[filterItem.field as keyof typeof item];

              if (filterItem.operator === 'contains') {
                return String(value)
                  .toLowerCase()
                  .includes(filterItem.value.toLowerCase());
              }
              if (filterItem.operator === 'equals') {
                return String(value) === filterItem.value;
              }
              if (filterItem.operator === 'startsWith') {
                return String(value)
                  .toLowerCase()
                  .startsWith(filterItem.value.toLowerCase());
              }
              if (filterItem.operator === 'endsWith') {
                return String(value)
                  .toLowerCase()
                  .endsWith(filterItem.value.toLowerCase());
              }
              if (filterItem.operator === 'isEmpty') {
                return !value || String(value).trim() === '';
              }
              if (filterItem.operator === 'isNotEmpty') {
                return value && String(value).trim() !== '';
              }
              return true;
            });
          }
          // At least one filter item must match (OR logic)
          return filters.items.some((filterItem: any) => {
            const value = item[filterItem.field as keyof typeof item];

            if (filterItem.operator === 'contains') {
              return String(value)
                .toLowerCase()
                .includes(filterItem.value.toLowerCase());
            }
            if (filterItem.operator === 'equals') {
              return String(value) === filterItem.value;
            }
            if (filterItem.operator === 'startsWith') {
              return String(value)
                .toLowerCase()
                .startsWith(filterItem.value.toLowerCase());
            }
            if (filterItem.operator === 'endsWith') {
              return String(value)
                .toLowerCase()
                .endsWith(filterItem.value.toLowerCase());
            }
            if (filterItem.operator === 'isEmpty') {
              return !value || String(value).trim() === '';
            }
            if (filterItem.operator === 'isNotEmpty') {
              return value && String(value).trim() !== '';
            }
            return true;
          });
        });
      }
    } catch (error) {
      // Invalid filter, return all data
    }
  }

  // Apply sorting
  if (sortModel && typeof sortModel === 'string') {
    try {
      const sorts = JSON.parse(sortModel as string);
      if (sorts.length > 0) {
        filteredData.sort((a, b) => {
          for (const sort of sorts) {
            const aVal = a[sort.field as keyof typeof a];
            const bVal = b[sort.field as keyof typeof b];

            if (aVal < bVal) {
              return sort.sort === 'desc' ? 1 : -1;
            }
            if (aVal > bVal) {
              return sort.sort === 'desc' ? -1 : 1;
            }
          }
          return 0;
        });
      }
    } catch (error) {
      // Invalid sort, keep original order
    }
  }

  // Apply pagination
  const startIndex = Number(page) * Number(pageSize);
  const endIndex = startIndex + Number(pageSize);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return res.json({
    data: paginatedData,
    total: filteredData.length,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

app.get('/api/employees/:id', (req, res) => {
  const id = Number(req.params.id);
  const employee = dummyData.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  return res.json(employee);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  // Server started
});
```

**What's happening here:**

- Express.js server is set up with CORS enabled for cross-origin requests
- Dummy employee data simulates a database with fields suitable for grouping (`department`, `role`) and aggregation (`salary`, `projects`)
- `/api/employees` endpoint is created with pagination, sorting, and filtering
- Each employee has a `projects` field (numeric) that can be aggregated along with `salary`

### 5. Add scripts to package.json files

In `server/package.json`, add:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### 6. Set up the client code

In the `client` directory, add a new directory called `components`.
Inside `components`, add a new file named `EmployeeDataGrid.tsx` with the following boilerplate.
(You'll build out this component in part two of this tutorial.)

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
        MUI X Data Grid Premium - Aggregation & Row Grouping
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This example demonstrates row grouping by department and role, with aggregation functions
        applied to salary (sum) and projects (sum). Try expanding/collapsing groups to see
        aggregated values.
      </Typography>
    </Box>
  );
};

export default EmployeeDataGrid;
```

Update `client/src/App.tsx` with the boilerplate setup below:

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

**What's happening here:**

- `CssBaseline` is a Material UI component that applies consistent baseline CSS styles across different browsers, removing default margins and padding, and setting up consistent font rendering.

Replace the boilerplate code in `client/src/main.tsx` with the following:

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

### 7. Run the application

Start the server:

```bash
cd server
pnpm run dev
```

In a new terminal, start the client:

```bash
cd client
pnpm run dev
```

The server runs on `http://localhost:3001` and the client on `http://localhost:5173`.

## Part two: Data Grid setup with aggregation and row grouping

In this section, you'll build out the Grid's aggregation and row grouping functionality.
All steps that follow take place in the `EmployeeDataGrid.tsx` component you created in step 6.

### 8. Define the data structure

Define what your data looks like by creating interfaces that match your server response.
Add the following interfaces below the imports in `EmployeeDataGrid.tsx`:

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

interface ApiResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
}
```

**What's happening here:**

- `Employee` defines the structure of each row in your grid, including the `projects` field for aggregation
- `ApiResponse` defines what the server sends back, including metadata like total count and pagination info
- The `total` field tells the grid how many total rows exist

### 9. Define the grid columns

Below the interfaces, define how each column should appear and behave:

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
  {
    field: 'projects',
    headerName: 'Projects',
    width: 120,
    type: 'number',
  },
];
```

**What's happening here:**

- `field` maps to the property names in your `Employee` interface
- `headerName` is what users see in the column header
- `width` sets the initial column width in pixels
- `type: 'number'` tells the grid these columns contain numeric data, which is required for aggregation
- `valueFormatter` formats the salary column to display as currency

### 10. Set up data fetching

Since we're using client-side aggregation and row grouping, we'll fetch all the data at once.
Add state and a fetch effect to the component:

```tsx
function EmployeeDataGrid() {
  const apiRef = useGridApiRef();
  const [rows, setRows] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch data from the server
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/employees');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse = await response.json();
        setRows(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    // ... component JSX
  );
}
```

**What's happening here:**

- `apiRef` is a reference to the grid API, needed for the `useKeepGroupedColumnsHidden` hook
- `rows` state holds the employee data
- `loading` state tracks the fetch status
- The `useEffect` hook fetches all employee data when the component mounts
- We fetch all data because aggregation and row grouping work best with the full dataset on the client side

### 11. Configure row grouping and aggregation

Set up the initial state with row grouping and aggregation models:

```tsx
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
```

**What's happening here:**

- `useKeepGroupedColumnsHidden` is a hook that automatically hides columns that are used for grouping, keeping the UI clean
- `rowGrouping.model` specifies which columns to group by: first by `department`, then by `role` within each department
- `aggregation.model` specifies which aggregation functions to apply: `sum` for both `salary` and `projects` columns
- The grid will automatically calculate aggregated values for each group

### 12. Configure aggregation position

Set where aggregated values appear in the grid:

```tsx
getAggregationPosition={(groupNode) =>
  groupNode.depth === -1 ? 'footer' : 'inline'
}
```

**What's happening here:**

- `getAggregationPosition` is a function that determines where to display aggregated values
- For the root level (`depth === -1`), aggregated values appear in a footer row
- For nested groups, aggregated values appear inline with the group header
- This provides a clear visual hierarchy of aggregated data

### 13. Render the Data Grid Premium

Finally, render the Grid with your configuration:

```tsx
<DataGridPremium
  apiRef={apiRef}
  rows={rows}
  columns={columns}
  loading={loading}
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

- `DataGridPremium` is the Premium version of the Data Grid, required for aggregation and row grouping features
- `apiRef` provides the grid API reference
- `rows` contains the employee data
- `columns` defines the column structure
- `loading` shows a loading state while data is being fetched
- `initialState` configures the initial row grouping and aggregation
- `pagination` enables pagination controls
- `pageSizeOptions` lets users choose how many rows to see per page
- `disableRowSelectionOnClick` prevents row selection when clicking cells
- `getAggregationPosition` controls where aggregated values are displayed

### 14. Put it all together

Combining steps 8 through 13, the complete component looks like this:

```tsx
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
  const [rows, setRows] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch data from the server
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/employees');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: ApiResponse = await response.json();
        setRows(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        rows={rows}
        columns={columns}
        loading={loading}
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

Now your Data Grid should successfully display employee data grouped by department and role, with aggregated values (sum of salary and projects) shown for each group.
You can expand and collapse groups to explore the data hierarchy, and see how aggregated values update based on the visible rows.

## Understanding aggregation and row grouping

### Row grouping

Row grouping organizes your data into hierarchical groups based on column values.
In this tutorial, we group by:

1. **Department** - The primary grouping level
2. **Role** - A nested grouping within each department

This creates a tree structure where you can expand or collapse groups to see the individual rows within them.

### Aggregation functions

Aggregation functions calculate summary values across rows in a group.
Common aggregation functions include:

- `sum` - Adds up all values in the group
- `avg` - Calculates the average value
- `min` - Finds the minimum value
- `max` - Finds the maximum value
- `size` - Counts the number of rows in the group

In this tutorial, we use `sum` to calculate:
- Total salary for each group
- Total number of projects for each group

### Aggregation position

The `getAggregationPosition` function controls where aggregated values appear:

- `'footer'` - Shows aggregated values in a footer row (typically used for the root level)
- `'inline'` - Shows aggregated values next to the group header (typically used for nested groups)
- `null` - Hides aggregated values for that group level

## Learn more

To learn more about the features covered in this tutorial, check out the following documentation:

- [Row grouping documentation](/x/react-data-grid/row-grouping/)
- [Aggregation documentation](/x/react-data-grid/aggregation/)
- [Data Grid Premium features](/x/react-data-grid/getting-started/#premium-features)
