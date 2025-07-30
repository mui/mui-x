# Data Grid - Overlays

The various Data Grid overlays.

## Loading overlay

To display a loading overlay and signify that the Data Grid is in a loading state, set the `loading` prop to `true`.

The Data Grid supports 3 loading overlay variants out of the box:

- `skeleton`: an animated placeholder of the Data Grid.
- `linear-progress`: an indeterminate linear progress bar.
- `circular-progress`: a circular loading spinner.

The type of loading overlay to display can be set via `slotProps.loadingOverlay` for the following two props:

- `variant` (default: `linear-progress`): when `loading` and there are rows in the table.
- `noRowsVariant` (default: `skeleton`): when `loading` and there are not any rows in the table.

```tsx
<DataGrid
  {...data}
  loading
  slotProps={{
    loadingOverlay: {
      variant: 'linear-progress',
      noRowsVariant: 'skeleton',
    },
  }}
/>
```

### Skeleton

An animated placeholder of the Data Grid.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function LoadingOverlaySkeleton() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 9,
  });

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        {...data}
        loading
        slotProps={{
          loadingOverlay: {
            variant: 'skeleton',
            noRowsVariant: 'skeleton',
          },
        }}
      />
    </Box>
  );
}

```

### Linear progress

An indeterminate linear progress bar.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function LoadingOverlayLinearProgress() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        {...data}
        loading
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
            noRowsVariant: 'linear-progress',
          },
        }}
      />
    </Box>
  );
}

```

### Circular progress

A circular loading spinner.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function LoadingOverlayCircularProgress() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 6,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGrid
        {...data}
        loading
        slotProps={{
          loadingOverlay: {
            variant: 'circular-progress',
            noRowsVariant: 'circular-progress',
          },
        }}
      />
    </Box>
  );
}

```

### Custom component

If you want to customize the no-rows overlay, a component can be passed to the `loadingOverlay` slot.

In the following demo, a labeled determinate [CircularProgress](/material-ui/react-progress/#circular-determinate) component is rendered in place of the default loading overlay, with some additional _Loading rows…_ text.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: 'rgba(18, 18, 18, 0.9)',
  ...theme.applyStyles('light', {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  }),
}));

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.primary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function CustomLoadingOverlay() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <StyledGridOverlay>
      <CircularProgressWithLabel value={progress} />
      <Box sx={{ mt: 2 }}>Loading rows…</Box>
    </StyledGridOverlay>
  );
}

export default function LoadingOverlayCustom() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        slots={{
          loadingOverlay: CustomLoadingOverlay,
        }}
        loading
        {...data}
      />
    </div>
  );
}

```

## No columns overlay

The no-columns overlay is displayed when the Data Grid has no columns, or when all columns are hidden.

The "Manage columns" button is displayed when all columns are hidden and `disableColumnSelector` is `false`.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function NoColumnsOverlay() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50,
    maxColumns: 6,
  });

  const initialColumns = React.useMemo(
    () =>
      data.columns.reduce(
        (acc, col) => {
          acc[col.field] = false;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    [data.columns],
  );

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid
        {...data}
        initialState={{
          columns: {
            columnVisibilityModel: initialColumns,
          },
        }}
      />
    </Box>
  );
}

```

### Custom component

If you want to customize the no-columns overlay, a component can be passed to the `noColumnsOverlay` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No columns" message.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {
  DataGrid,
  GridPreferencePanelsValue,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: '100%',
  '& .no-columns-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-columns-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoColumnsOverlay() {
  const apiRef = useGridApiContext();

  const handleOpenManageColumns = () => {
    apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
  };

  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 370 260"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-columns-secondary"
          d="M10 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10C0 4.477 4.477 0 10 0Zm50 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v240c0 5.523-4.477 10-10 10s-10-4.477-10-10V10c0-5.523 4.477-10 10-10ZM110 194c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10v-46c0-5.523 4.477-10 10-10Zm150 0c5.523 0 10 4.477 10 10v46c0 5.523-4.477 10-10 10s-10-4.477-10-10v-46c0-5.523 4.477-10 10-10Zm-100 27c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10v-19c0-5.523 4.477-10 10-10Zm50 0c5.523 0 10 4.477 10 10v19c0 5.523-4.477 10-10 10s-10-4.477-10-10v-19c0-5.523 4.477-10 10-10Z"
        />
        <path
          className="no-columns-primary"
          d="M185 71c-32.585 0-59 26.415-59 59s26.415 59 59 59 59-26.415 59-59-26.415-59-59-59Zm-79 59c0-43.63 35.37-79 79-79s79 35.37 79 79c0 43.631-35.37 79-79 79s-79-35.369-79-79Zm109.296-30.56c3.905 3.905 3.905 10.236 0 14.142l-16.286 16.286 16.286 16.286c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-16.286-16.286-16.286 16.286c-3.905 3.905-10.237 3.905-14.142 0-3.906-3.905-3.906-10.237 0-14.142l16.286-16.286-16.286-16.286c-3.906-3.905-3.906-10.237 0-14.142 3.905-3.906 10.237-3.906 14.142 0l16.286 16.286 16.286-16.286c3.905-3.906 10.237-3.906 14.142 0Z"
        />
      </svg>
      <Stack sx={{ mt: 2 }} gap={1}>
        No columns
        <Button onClick={handleOpenManageColumns} size="small">
          Manage columns
        </Button>
      </Stack>
    </StyledGridOverlay>
  );
}

export default function NoColumnsOverlayCustom() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50,
    maxColumns: 6,
  });

  const initialColumns = React.useMemo(
    () =>
      data.columns.reduce(
        (acc, col) => {
          acc[col.field] = false;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    [data.columns],
  );

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid
        {...data}
        initialState={{
          columns: {
            columnVisibilityModel: initialColumns,
          },
        }}
        slots={{
          noColumnsOverlay: CustomNoColumnsOverlay,
        }}
      />
    </Box>
  );
}

```

## No rows overlay

The no-rows overlay is displayed when the Data Grid has no rows.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function NoRowsOverlay() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 0,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid {...data} rows={[]} />
    </Box>
  );
}

```

### Custom component

If you want to customize the no-rows overlay, a component can be passed to the `noRowsOverlay` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No rows" message.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-rows-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No rows</Box>
    </StyledGridOverlay>
  );
}

export default function NoRowsOverlayCustom() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        {...data}
        rows={[]}
      />
    </div>
  );
}

```

## No results overlay

The no-results overlay is displayed when the Data Grid has no results after filtering.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function NoResultsOverlay() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 6,
    maxColumns: 6,
  });

  return (
    <Box sx={{ width: '100%', height: 340 }}>
      <DataGrid
        {...data}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: ['abc'],
            },
          },
        }}
        showToolbar
      />
    </Box>
  );
}

```

### Custom component

If you want to customize the no results overlay, a component can be passed to the `noResults` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No results found" message.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-results-primary': {
    fill: '#3D4751',
    ...theme.applyStyles('light', {
      fill: '#AEB8C2',
    }),
  },
  '& .no-results-secondary': {
    fill: '#1D2126',
    ...theme.applyStyles('light', {
      fill: '#E8EAED',
    }),
  },
}));

function CustomNoResultsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 523 299"
        aria-hidden
        focusable="false"
      >
        <path
          className="no-results-primary"
          d="M262 20c-63.513 0-115 51.487-115 115s51.487 115 115 115 115-51.487 115-115S325.513 20 262 20ZM127 135C127 60.442 187.442 0 262 0c74.558 0 135 60.442 135 135 0 74.558-60.442 135-135 135-74.558 0-135-60.442-135-135Z"
        />
        <path
          className="no-results-primary"
          d="M348.929 224.929c3.905-3.905 10.237-3.905 14.142 0l56.569 56.568c3.905 3.906 3.905 10.237 0 14.143-3.906 3.905-10.237 3.905-14.143 0l-56.568-56.569c-3.905-3.905-3.905-10.237 0-14.142ZM212.929 85.929c3.905-3.905 10.237-3.905 14.142 0l84.853 84.853c3.905 3.905 3.905 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0l-84.853-84.853c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-results-primary"
          d="M212.929 185.071c-3.905-3.905-3.905-10.237 0-14.142l84.853-84.853c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-84.853 84.853c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-results-secondary"
          d="M0 43c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 53 0 48.523 0 43ZM0 89c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 99 0 94.523 0 89ZM0 135c0-5.523 4.477-10 10-10h74c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 181c0-5.523 4.477-10 10-10h80c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 227c0-5.523 4.477-10 10-10h100c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM523 227c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10ZM523 181c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 135c0 5.523-4.477 10-10 10h-74c-5.523 0-10-4.477-10-10s4.477-10 10-10h74c5.523 0 10 4.477 10 10ZM523 89c0 5.523-4.477 10-10 10h-80c-5.523 0-10-4.477-10-10s4.477-10 10-10h80c5.523 0 10 4.477 10 10ZM523 43c0 5.523-4.477 10-10 10H413c-5.523 0-10-4.477-10-10s4.477-10 10-10h100c5.523 0 10 4.477 10 10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No results found.</Box>
    </StyledGridOverlay>
  );
}

export default function NoResultsOverlayCustom() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 6,
    maxColumns: 6,
  });
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        showToolbar
        slots={{
          noResultsOverlay: CustomNoResultsOverlay,
        }}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [],
              quickFilterValues: ['abc'],
            },
          },
        }}
      />
    </div>
  );
}

```

## Empty pivot overlay

The empty pivot overlay is displayed when pivot mode is enabled but fields have been added to the rows section.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  GridInitialState,
} from '@mui/x-data-grid-premium';

const rows: GridRowModel[] = [
  { id: 1, product: 'Apples', region: 'North', quarter: 'Q1', sales: 1000 },
  { id: 2, product: 'Apples', region: 'South', quarter: 'Q1', sales: 1200 },
  { id: 3, product: 'Oranges', region: 'North', quarter: 'Q1', sales: 800 },
  { id: 4, product: 'Oranges', region: 'South', quarter: 'Q1', sales: 900 },
  { id: 5, product: 'Apples', region: 'North', quarter: 'Q2', sales: 1100 },
  { id: 6, product: 'Apples', region: 'South', quarter: 'Q2', sales: 1300 },
  { id: 7, product: 'Oranges', region: 'North', quarter: 'Q2', sales: 850 },
  { id: 8, product: 'Oranges', region: 'South', quarter: 'Q2', sales: 950 },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const columns: GridColDef[] = [
  { field: 'product', headerName: 'Product' },
  { field: 'region', headerName: 'Region' },
  { field: 'quarter', headerName: 'Quarter' },
  {
    field: 'sales',
    headerName: 'Sales',
    type: 'number',
    valueFormatter: (value) => {
      if (!value) {
        return '';
      }
      return currencyFormatter.format(value);
    },
  },
];

const pivotModel: GridPivotModel = {
  rows: [],
  columns: [],
  values: [],
};

const initialState: GridInitialState = {
  pivoting: {
    model: pivotModel,
    enabled: true,
  },
};

export default function EmptyPivotOverlay() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        rows={rows}
        columns={columns}
        initialState={initialState}
        columnGroupHeaderHeight={36}
        showToolbar
      />
    </div>
  );
}

```

### Custom component

To customize the empty pivot overlay, pass a custom component to the `emptyPivotOverlay` slot.

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
