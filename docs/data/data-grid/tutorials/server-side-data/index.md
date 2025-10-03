---
title: Tutorial - Data Grid with Server-side Data
description: TK.
---

# Build a Data Grid with Server-side Data

This tutorial walks you through building a Data Grid that fetches data from a server with pagination, sorting, and filtering.

## Prerequisites

- Basic React knowledge
- Understanding of TypeScript interfaces
- Familiarity with async/await and fetch API

## Part one: app setup

### 1. Create the project structure

Create a new directory and set up the folder structure:

```bash
mkdir server-side-data
cd server-side-data
mkdir client server
```

### 2. Initialize the server

Navigate to the server directory and initialize:

```bash
cd server
pnpm init
```

Install server dependencies:

```bash
pnpm install express cors
pnpm install --save-dev typescript @types/express @types/node tsx
```

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
cd ../client
pnpm create vite@latest . -- --template react-ts
pnpm install
```

Install MUI dependencies:

```bash
pnpm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid-pro @fontsource/roboto
```

### 4. Set up the server code

Create `server/src/index.ts`:

```ts
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

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

app.get('/api/employees', (req, res) => {
  const { page = 0, pageSize = 40, sortModel = [], filterModel = {} } = req.query;

  let filteredData = [...dummyData];

  // Apply filtering
  if (filterModel && typeof filterModel === 'string') {
    try {
      const filters = JSON.parse(filterModel as string);
      if (filters.items && filters.items.length > 0) {
        filteredData = filteredData.filter((item) => {
          return filters.items.every((filter: any) => {
            const value = item[filter.columnField as keyof typeof item];
            if (filter.operatorValue === 'contains') {
              return String(value)
                .toLowerCase()
                .includes(filter.value.toLowerCase());
            }
            if (filter.operatorValue === 'equals') {
              return String(value) === filter.value;
            }
            if (filter.operatorValue === 'startsWith') {
              return String(value)
                .toLowerCase()
                .startsWith(filter.value.toLowerCase());
            }
            return true;
          });
        });
      }
    } catch (e) {
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

            if (aVal < bVal) return sort.sort === 'desc' ? 1 : -1;
            if (aVal > bVal) return sort.sort === 'desc' ? -1 : 1;
          }
          return 0;
        });
      }
    } catch (e) {
      // Invalid sort, keep original order
    }
  }

  // Apply pagination
  const startIndex = Number(page) * Number(pageSize);
  const endIndex = startIndex + Number(pageSize);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    total: filteredData.length,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**What's happening here:**

- Express server is set up with CORS enabled for cross-origin requests
- Dummy employee data simulates a database
- `/api/employees` endpoint is created with pagination, sorting, and filtering
- Filters can be applied based on column field, operator, and value
- Data can be sorted by specified fields in ascending or descending order
- Results are paginated using `page` and `pageSize` parameters
- Data is returned in the format expected by the Data Grid

### 5. Set up the client code

Update `client/src/App.tsx`:

```ts
import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import EmployeeDataGrid from './components/EmployeeDataGrid';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <EmployeeDataGrid />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### 6. Add scripts to package.json files

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

### 8. Define the data structure

Define what your data looks like by creating interfaces that match your server response:

```ts
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

Define how each column should appear and behave:

```ts
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'department', headerName: 'Department', width: 150 },
  { field: 'salary', headerName: 'Salary', width: 120 },
  { field: 'startDate', headerName: 'Start Date', width: 130 },
];
```

**What's happening here:**

- `field` maps to the property names in your `Employee` interface
- `headerName` is what users see in the column header
- `width` sets the initial column width in pixels
- Each column automatically supports sorting and filtering

### 10. Set up GridDataSource

The `GridDataSource` tells the grid how to fetch data:

```ts
const dataSource: GridDataSource = useMemo(
  () => ({
    getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      // You'll implement this function next
    },
  }),
  [],
);
```

**What's happening here:**

- `getRows` is an async function that the grid calls whenever it needs data
- `params` contains all the information about what data the grid needs
- Wrap it in `useMemo` to prevent recreating the function on every render

### 11. Build the URL parameters

Inside `getRows`, construct the API call with the grid's current state:

```ts
const urlParams = new URLSearchParams({
  page: params.paginationModel?.page?.toString() || '0',
  pageSize: params.paginationModel?.pageSize?.toString() || '40',
  sortModel: JSON.stringify(params.sortModel || []),
  filterModel: JSON.stringify(params.filterModel || {}),
});
```

**What's happening here:**

- `params.paginationModel.page` tells you which page the user is viewing (0-based)
- `params.paginationModel.pageSize` tells you how many rows per page
- `params.sortModel` contains which columns are sorted and in what direction
- `params.filterModel` contains any active filters

### 12. Make the API call

Fetch the data from your server:

```ts
const response = await fetch(
  `http://localhost:3001/api/employees?${urlParams.toString()}`,
);

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const result: ApiResponse = await response.json();
```

### 13. Return the data to the grid

Return the data in the format the grid expects:

```ts
return {
  rows: result.data,
  rowCount: result.total,
};
```

### 14. Put it all together

Combining all the previous steps in part two, the complete `getRows` function should look like this:

```ts
const dataSource: GridDataSource = useMemo(
  () => ({
    getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      const urlParams = new URLSearchParams({
        page: params.paginationModel?.page?.toString() || '0',
        pageSize: params.paginationModel?.pageSize?.toString() || '40',
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

Finally, render the grid with your configuration:

```ts
<DataGridPro
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

```ts
return (
  <Box sx={{ height: 600, width: '100%' }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Employee Management
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Server-side data with pagination, sorting, and filtering
    </Typography>

    <DataGridPro
      columns={columns}
      dataSource={dataSource}
      pagination
      pageSizeOptions={[5, 10, 25, 100]}
      disableRowSelectionOnClick
    />
  </Box>
);
```

### Complete component code

Here is the complete `EmployeeDataGrid.tsx` component for reference:

```ts
import React, { useMemo } from 'react';
import { DataGridPro, type GridColDef, type GridDataSource, type GridGetRowsParams, type GridGetRowsResponse } from '@mui/x-data-grid-pro';
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

const EmployeeDataGrid: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 130 },
  ];

  const dataSource: GridDataSource = useMemo(() => ({
    getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      const urlParams = new URLSearchParams({
        page: params.paginationModel?.page?.toString() || '0',
        pageSize: params.paginationModel?.pageSize?.toString() || '40',
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
  }), []);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Employee Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Server-side data with pagination, sorting, and filtering
      </Typography>

      <DataGridPro
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
