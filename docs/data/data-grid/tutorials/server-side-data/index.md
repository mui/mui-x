---
title: Tutorial - Data Grid with Server-side Data
description: Learn how to use the Data Source layer to streamline communications between the Data Grid and server-side data.
---

# Build a Data Grid with Server-side Data

## Overview

This tutorial walks you through building a Data Grid that fetches data from a server with pagination, sorting, and filtering.
The primary purpose is to demonstrate the use of the [Data Source layer](/x/react-data-grid/server-side-data/), which streamlines the development of key Data Grid features when working with server-side data by providing an interface for communications between the Grid on the client and the data on the server.

:::success
If you'd rather skip the tutorial entirely, you can check out [the complete app code on GitHub](https://github.com/mui/mui-x/tree/master/examples/server-side-data/).
:::

## Prerequisites

- Basic React knowledge
- Understanding of TypeScript interfaces
- Familiarity with async/await and fetch APIs

### Relevant documentation

The docs listed below may be useful if you're new to the MUI X Data Grid:

- [Server-side data with the Data Source layer](/x/react-data-grid/server-side-data/)
- [Column definition](/x/react-data-grid/column-definition/)
- [Pagination](/x/react-data-grid/pagination/)
- [Sorting](/x/react-data-grid/sorting/)

## Part one: App setup

In part one, you'll set up the basic scaffolding for a full-stack React app using Vite on the front end and Express.js for the back end.

### 1. Create the project structure

Create a new directory and set up the folder structure:

```bash
mkdir server-side-data &&
cd server-side-data &&
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
See the [Material UI installation page](https://mui.com/material-ui/getting-started/installation/) for more details.
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

Install Material UI and MUI X dependencies:

```bash
pnpm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid @fontsource/roboto
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

// Dummy data - simulating a database
const dummyData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 75000,
    startDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 65000,
    startDate: '2023-02-20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Manager',
    department: 'Product',
    salary: 85000,
    startDate: '2022-11-10',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 80000,
    startDate: '2023-03-05',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 70000,
    startDate: '2023-04-12',
  },
  {
    id: 6,
    name: 'Diana Davis',
    email: 'diana@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 68000,
    startDate: '2023-01-30',
  },
  {
    id: 7,
    name: 'Eve Miller',
    email: 'eve@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 82000,
    startDate: '2022-12-18',
  },
  {
    id: 8,
    name: 'Frank Garcia',
    email: 'frank@example.com',
    role: 'Manager',
    department: 'Sales',
    salary: 90000,
    startDate: '2022-09-25',
  },
  {
    id: 9,
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 72000,
    startDate: '2023-05-08',
  },
  {
    id: 10,
    name: 'Henry Taylor',
    email: 'henry@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 78000,
    startDate: '2023-06-14',
  },
  {
    id: 11,
    name: 'Ivy Chen',
    email: 'ivy@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 76000,
    startDate: '2023-07-22',
  },
  {
    id: 12,
    name: 'Jack Anderson',
    email: 'jack@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 67000,
    startDate: '2023-08-15',
  },
  {
    id: 13,
    name: 'Kate Martinez',
    email: 'kate@example.com',
    role: 'Manager',
    department: 'Marketing',
    salary: 88000,
    startDate: '2023-09-03',
  },
  {
    id: 14,
    name: 'Liam Thompson',
    email: 'liam@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 71000,
    startDate: '2023-10-11',
  },
  {
    id: 15,
    name: 'Maya Rodriguez',
    email: 'maya@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 79000,
    startDate: '2023-11-28',
  },
  {
    id: 16,
    name: 'Noah White',
    email: 'noah@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 66000,
    startDate: '2023-12-05',
  },
  {
    id: 17,
    name: 'Olivia Harris',
    email: 'olivia@example.com',
    role: 'Manager',
    department: 'HR',
    salary: 87000,
    startDate: '2024-01-14',
  },
  {
    id: 18,
    name: 'Paul Clark',
    email: 'paul@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 73000,
    startDate: '2024-02-20',
  },
  {
    id: 19,
    name: 'Quinn Lewis',
    email: 'quinn@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 81000,
    startDate: '2024-03-08',
  },
  {
    id: 20,
    name: 'Ruby Hall',
    email: 'ruby@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 69000,
    startDate: '2024-04-12',
  },
  {
    id: 21,
    name: 'Sam Young',
    email: 'sam@example.com',
    role: 'Manager',
    department: 'Finance',
    salary: 92000,
    startDate: '2024-05-18',
  },
  {
    id: 22,
    name: 'Tara King',
    email: 'tara@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 74000,
    startDate: '2024-06-25',
  },
  {
    id: 23,
    name: 'Uma Patel',
    email: 'uma@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 77000,
    startDate: '2024-07-30',
  },
  {
    id: 24,
    name: 'Victor Moore',
    email: 'victor@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 64000,
    startDate: '2024-08-14',
  },
  {
    id: 25,
    name: 'Wendy Scott',
    email: 'wendy@example.com',
    role: 'Manager',
    department: 'Operations',
    salary: 86000,
    startDate: '2024-09-22',
  },
  {
    id: 26,
    name: 'Xander Green',
    email: 'xander@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 75000,
    startDate: '2024-10-05',
  },
  {
    id: 27,
    name: 'Yara Adams',
    email: 'yara@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 80000,
    startDate: '2024-11-12',
  },
  {
    id: 28,
    name: 'Zane Baker',
    email: 'zane@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 67000,
    startDate: '2024-12-18',
  },
  {
    id: 29,
    name: 'Aria Nelson',
    email: 'aria@example.com',
    role: 'Manager',
    department: 'Legal',
    salary: 95000,
    startDate: '2025-01-25',
  },
  {
    id: 30,
    name: 'Blake Carter',
    email: 'blake@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 72000,
    startDate: '2025-02-28',
  },
  {
    id: 31,
    name: 'Cora Mitchell',
    email: 'cora@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 78000,
    startDate: '2025-03-15',
  },
  {
    id: 32,
    name: 'Dexter Perez',
    email: 'dexter@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 65000,
    startDate: '2025-04-20',
  },
  {
    id: 33,
    name: 'Echo Roberts',
    email: 'echo@example.com',
    role: 'Manager',
    department: 'Sales',
    salary: 89000,
    startDate: '2025-05-10',
  },
  {
    id: 34,
    name: 'Finn Turner',
    email: 'finn@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 71000,
    startDate: '2025-06-18',
  },
  {
    id: 35,
    name: 'Gemma Phillips',
    email: 'gemma@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 82000,
    startDate: '2025-07-25',
  },
  {
    id: 36,
    name: 'Hawk Campbell',
    email: 'hawk@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 68000,
    startDate: '2025-08-30',
  },
  {
    id: 37,
    name: 'Indigo Parker',
    email: 'indigo@example.com',
    role: 'Manager',
    department: 'Product',
    salary: 87000,
    startDate: '2025-09-05',
  },
  {
    id: 38,
    name: 'Jasper Evans',
    email: 'jasper@example.com',
    role: 'Analyst',
    department: 'Data',
    salary: 73000,
    startDate: '2025-10-12',
  },
  {
    id: 39,
    name: 'Kai Edwards',
    email: 'kai@example.com',
    role: 'Developer',
    department: 'Engineering',
    salary: 79000,
    startDate: '2025-11-20',
  },
  {
    id: 40,
    name: 'Luna Collins',
    email: 'luna@example.com',
    role: 'Designer',
    department: 'Design',
    salary: 66000,
    startDate: '2025-12-28',
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
- Dummy employee data simulates a database
- `/api/employees` endpoint is created with pagination, sorting, and filtering
- Filters can be applied based on column field, operator, and value
- Data can be sorted by specified fields in ascending or descending order
- Results are paginated using `page` and `pageSize` parameters
- Data is returned in the format expected by the Data Grid

:::info
This tutorial's backend server implements basic server-side functionality:

- Pagination: Index-based pagination with `page` and `pageSize` parameters
- Sorting: Single-column sorting in ascending or descending order
- Filtering: Supports operators like `contains`, `equals`, `startsWith`, `endsWith`, `isEmpty`, and `isNotEmpty` with `And`/`Or` logic operators

If your app requires additional features (such as [multi-column sorting](/x/react-data-grid/sorting/#multi-sorting), [advanced filtering operators](/x/react-data-grid/filtering/customization/), [cursor-based pagination](/x/react-data-grid/server-side-data/recipes/#cursor-based-pagination), or other server-side operations), you'll need to implement them in your backend accordingly.
:::

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
import { useMemo } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridDataSource,
  type GridGetRowsParams,
  type GridGetRowsResponse,
} from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const EmployeeDataGrid = () => {
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        MUI X Data Grid with the Data Source layer
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Server-side data with pagination, sorting, and filtering.
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

- `CssBaseline` is a Material UI component that applies consistent baseline CSS styles across different browsers, removing default margins and padding, and setting up consistent font rendering.

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

## Part two: Data Grid setup

In this section, you'll build out the Grid's data fetching functionality.
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
}

interface ApiResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
}
```

**What's happening here:**

- `Employee` defines the structure of each row in your grid
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
  { field: 'salary', headerName: 'Salary', width: 120 },
  { field: 'startDate', headerName: 'Start Date', width: 130 },
];

const EmployeeDataGrid = () => { //...
```

**What's happening here:**

- `field` maps to the property names in your `Employee` interface
- `headerName` is what users see in the column header
- `width` sets the initial column width in pixels
- Each column automatically supports sorting and filtering

### 10. Set up GridDataSource

The `GridDataSource` tells the Grid how to fetch data:

```tsx
function EmployeeDataGrid() {
  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
        // You'll implement this function next
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
    </Box>
  );
}
```

**What's happening here:**

- `getRows` is an async function that the grid calls whenever it needs data
- `params` contains all the information about what data the grid needs
- Wrap it in `React.useMemo` to prevent recreating the function on every render

### 11. Build the URL parameters

Inside `getRows`, construct the API call with the grid's current state:

```tsx
const dataSource: GridDataSource = useMemo(
  () => ({
    getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      const urlParams = new URLSearchParams({
        paginationModel: JSON.stringify(params.paginationModel),
        sortModel: JSON.stringify(params.sortModel || []),
        filterModel: JSON.stringify(params.filterModel || {}),
      });
    },
  }),
  [],
);
```

**What's happening here:**

- `params.paginationModel` contains the pagination state
- `params.sortModel` contains which columns are sorted and in what direction
- `params.filterModel` contains any active filters

### 12. Make the API call

Fetch the data from your server:

```tsx
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
```

### 13. Return the data to the grid

Return the data in the format the Grid expects:

```tsx
return {
  rows: result.data,
  rowCount: result.total,
};
```

### 14. Put it all together

Combining steps 10 through 13, the complete Data Source looks like this:

```tsx
const dataSource: GridDataSource = useMemo(
  () => ({
    getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      const urlParams = new URLSearchParams({
        paginationModel: JSON.stringify(params.paginationModel),
        sortModel: JSON.stringify(params.sortModel || []),
        filterModel: JSON.stringify(params.filterModel || {}),
      });

      const response = await fetch(
        `http://localhost:3001/api/employees?${urlParams.toString()}`,
      );

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
```

### 15. Render the Data Grid

Finally, render the Grid with your configuration:

```tsx
<DataGrid
  columns={columns}
  dataSource={dataSource}
  pagination
  pageSizeOptions={[5, 10, 25, 100]}
  disableRowSelectionOnClick
/>
```

**What's happening here:**

- `columns` defines your column structure
- `dataSource` provides your server-side data fetching logic
- `pagination` enables pagination controls
- `pageSizeOptions` lets users choose how many rows to see per page
- `disableRowSelectionOnClick` prevents row selection when clicking cells

### 16. Add the UI wrapper

Wrap everything in a container:

```tsx
return (
  <Box sx={{ height: 600, width: '100%' }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Employee Management
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Server-side data with pagination, sorting, and filtering
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
```

### 17. Complete component code

Here is the complete `EmployeeDataGrid.tsx` component:

```tsx
import { useMemo } from 'react';
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

const EmployeeDataGrid = () => {
  const dataSource: GridDataSource = useMemo(
    () => ({
      getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          sortModel: JSON.stringify(params.sortModel || []),
          filterModel: JSON.stringify(params.filterModel || {}),
        });

        const response = await fetch(
          `http://localhost:3001/api/employees?${urlParams.toString()}`,
        );

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
        MUI X Data Grid with the Data Source layer
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
};

export default EmployeeDataGrid;
```

Now your Data Grid should successfully fetch and render the dummy data from your server, and sorting, filtering, and pagination should all work as expected.

## Learn more

To learn more about the features covered in this tutorial, check out the [server-side data documentation](/x/react-data-grid/server-side-data/).
