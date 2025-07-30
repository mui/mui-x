# Data Grid - Scrolling

This section presents how to programmatically control the scroll.

## Scrolling to specific cells

You can scroll to a specific cell by calling `apiRef.current.scrollToIndexes()`.
The only argument that must be passed is an object containing the row index and the column index of the cell to scroll.
If the row or column index is not present, the Data Grid will not do any movement in the missing axis.

The following demo explores the usage of this API:

```tsx
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import {
  DataGridPro,
  useGridApiRef,
  gridExpandedRowCountSelector,
  gridVisibleColumnDefinitionsSelector,
  gridExpandedSortedRowIdsSelector,
  GridCellParams,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ScrollPlayground() {
  const apiRef = useGridApiRef();

  const [coordinates, setCoordinates] = React.useState({
    rowIndex: 0,
    colIndex: 0,
  });

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  React.useEffect(() => {
    const { rowIndex, colIndex } = coordinates;
    apiRef.current?.scrollToIndexes(coordinates);
    const id = gridExpandedSortedRowIdsSelector(apiRef)[rowIndex];
    const column = gridVisibleColumnDefinitionsSelector(apiRef)[colIndex];
    apiRef.current?.setCellFocus(id, column.field);
  }, [apiRef, coordinates]);

  const handleClick = (position: string) => () => {
    const maxRowIndex = gridExpandedRowCountSelector(apiRef) - 1;
    const maxColIndex = gridVisibleColumnDefinitionsSelector(apiRef).length - 1;

    setCoordinates((coords) => {
      switch (position) {
        case 'top':
          return { ...coords, rowIndex: Math.max(0, coords.rowIndex - 1) };
        case 'bottom':
          return { ...coords, rowIndex: Math.min(maxRowIndex, coords.rowIndex + 1) };
        case 'left':
          return { ...coords, colIndex: Math.max(0, coords.colIndex - 1) };
        case 'right':
          return { ...coords, colIndex: Math.min(maxColIndex, coords.colIndex + 1) };
        default:
          return { ...coords, rowIndex: 0, colIndex: 0 };
      }
    });
  };

  const handleCellClick = (params: GridCellParams) => {
    const rowIndex = gridExpandedSortedRowIdsSelector(apiRef).findIndex(
      (id) => id === params.id,
    );
    const colIndex = gridVisibleColumnDefinitionsSelector(apiRef).findIndex(
      (column) => column.field === params.field,
    );
    setCoordinates({ rowIndex, colIndex });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: 300, margin: '0 auto 16px' }}>
        <Grid container justifyContent="center">
          <Grid>
            <Button onClick={handleClick('top')}>top</Button>
          </Grid>
        </Grid>
        <Grid container textAlign="center">
          <Grid size={{ xs: 4 }}>
            <Button onClick={handleClick('left')}>left</Button>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <IconButton
              color="primary"
              aria-label="home"
              onClick={handleClick('home')}
            >
              <HomeIcon />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Button onClick={handleClick('right')}>right</Button>
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          <Grid>
            <Button onClick={handleClick('bottom')}>bottom</Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: 400 }}>
        <DataGridPro
          apiRef={apiRef}
          onCellClick={handleCellClick}
          hideFooter
          loading={loading}
          {...data}
        />
      </Box>
    </Box>
  );
}

```

## Scroll restoration

You can restore scroll to a previous position by definining `initialState.scroll` values `{ top: number, left: number }`. The Data Grid will mount at the specified scroll offset in pixels.

The following demo explores the usage of scroll restoration:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGridPro,
  useGridApiRef,
  gridVisibleColumnDefinitionsSelector,
  gridExpandedSortedRowIdsSelector,
  GridCellParams,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ScrollRestoration() {
  const apiRef = useGridApiRef();

  const [coordinates, setCoordinates] = React.useState({
    rowIndex: 0,
    colIndex: 0,
  });

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
  });

  React.useEffect(() => {
    const { rowIndex, colIndex } = coordinates;
    apiRef.current?.scrollToIndexes(coordinates);
    const id = gridExpandedSortedRowIdsSelector(apiRef)[rowIndex];
    const column = gridVisibleColumnDefinitionsSelector(apiRef)[colIndex];
    apiRef.current?.setCellFocus(id, column.field);
  }, [apiRef, coordinates]);

  const handleCellClick = (params: GridCellParams) => {
    const rowIndex = gridExpandedSortedRowIdsSelector(apiRef).findIndex(
      (id) => id === params.id,
    );
    const colIndex = gridVisibleColumnDefinitionsSelector(apiRef).findIndex(
      (column) => column.field === params.field,
    );
    setCoordinates({ rowIndex, colIndex });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 400 }}>
        <DataGridPro
          apiRef={apiRef}
          onCellClick={handleCellClick}
          hideFooter
          loading={loading}
          {...data}
          initialState={{
            ...data.initialState,
            scroll: { top: 1000, left: 1000 },
          }}
        />
      </Box>
    </Box>
  );
}

```

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of scrolling feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-scroll-api.json';

export default function ScrollApiNoSnap() {
  return <ApiDocs api={api} />;
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
