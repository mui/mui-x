# Data Grid - Events

Subscribe to the events emitted by the Data Grid to trigger custom behavior.

## Subscribing to events

You can subscribe to one of the [events emitted](/x/react-data-grid/events/#catalog-of-events) by providing an event handler to the Data Grid.

The handler is a method that's called with three arguments:

1. the parameters containing the information related to the event
2. the `MuiEvent` containing the DOM event or the React synthetic event, when available
3. the `GridCallbackDetails` containing the `GridApi`—only if Data Grid Pro or Data Grid Premium is being used

For example, here is an event handler for the `rowClick` event:

```tsx
const handleEvent: GridEventListener<'rowClick'> = (
  params, // GridRowParams
  event, // MuiEvent<React.MouseEvent<HTMLElement>>
  details, // GridCallbackDetails
) => {
  setMessage(`Movie "${params.row.title}" clicked`);
};
```

You can provide this event handler to the Data Grid in several ways:

### With the prop of the event

```tsx
<DataGrid onRowClick={handleEvent} {...other} />
```

:::info
Not all events have a dedicated prop.
Check out the examples in the [Catalog of events](#catalog-of-events) below to determine if a given event has a dedicated prop.
:::

The following demo shows how to subscribe to the `rowClick` event using the `onRowClick` prop—try it out by clicking on any row:

```tsx
import * as React from 'react';
import { DataGrid, GridEventListener } from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

export default function SubscribeToEventsProp() {
  const [message, setMessage] = React.useState('');
  const data = useMovieData();

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    setMessage(`Movie "${params.row.title}" clicked`);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ height: 300, width: '100%' }}>
        <DataGrid onRowClick={handleRowClick} {...data} />
      </Box>
      {message && <Alert severity="info">{message}</Alert>}
    </Stack>
  );
}

```

### With `useGridEvent`

```tsx
useGridEvent(apiRef, 'rowClick', handleEvent);
```

:::warning
This hook can only be used inside the scope of the Data Grid (that is inside component slots or cell renderers).
:::

The following demo shows how to subscribe to the `rowClick` event using `useGridEvent()`—try it out by clicking on any row:

```tsx
import * as React from 'react';
import {
  DataGrid,
  GridEventListener,
  GridFooter,
  useGridEvent,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useMovieData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

function Footer() {
  const [message, setMessage] = React.useState('');
  const apiRef = useGridApiContext();

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    setMessage(`Movie "${params.row.title}" clicked`);
  };

  useGridEvent(apiRef, 'rowClick', handleRowClick);

  return (
    <React.Fragment>
      <GridFooter />
      {message && <Alert severity="info">{message}</Alert>}
    </React.Fragment>
  );
}

export default function SubscribeToEventsHook() {
  const data = useMovieData();

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ height: 350, width: '100%' }}>
        <DataGrid {...data} slots={{ footer: Footer }} />
      </Box>
    </Stack>
  );
}

```

### With `apiRef.current.subscribeEvent`

```tsx
apiRef.current.subscribeEvent('rowClick', handleEvent);
```

The following demo shows how to subscribe to the `rowClick` event using `apiRef.current.subscribeEvent`—try it out by clicking on any row:

```tsx
import * as React from 'react';
import { DataGridPro, GridEventListener, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMovieData } from '@mui/x-data-grid-generator';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function SubscribeToEventsApiRef() {
  const apiRef = useGridApiRef();
  const [message, setMessage] = React.useState('');
  const data = useMovieData();

  React.useEffect(() => {
    const handleRowClick: GridEventListener<'rowClick'> = (params) => {
      setMessage(`Movie "${params.row.title}" clicked`);
    };

    // The `subscribeEvent` method will automatically unsubscribe in the cleanup function of the `useEffect`.
    return apiRef.current?.subscribeEvent('rowClick', handleRowClick);
  }, [apiRef]);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ height: 300, width: '100%' }}>
        <DataGridPro apiRef={apiRef} {...data} />
      </Box>
      {message && <Alert severity="info">{message}</Alert>}
    </Stack>
  );
}

```

:::warning
The `apiRef.current.subscribeEvent` method returns a cleaning callback that unsubscribes the given handler when called.
For instance, when used inside a `useEffect` hook, you should always return the cleaning callback.
Otherwise, you will have multiple registrations of the same event handler.
:::

## Disabling the default behavior

Depending on the use case, it might be necessary to disable the default action taken by an event.
The `MuiEvent` passed to the event handler has a `defaultMuiPrevented` property to control when the default behavior can be executed or not.
Set it to `true` to block the default handling of an event and implement your own.

```tsx
<DataGrid
  onCellClick={(params: GridCellParams, event: MuiEvent<React.MouseEvent>) => {
    event.defaultMuiPrevented = true;
  }}
/>
```

Usually, double-clicking a cell will put it into [edit mode](/x/react-data-grid/editing/).
The following example changes this behavior by also requiring the end user to press the <kbd class="key">Ctrl</kbd> key:

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DoubleClickWithCtrlToEdit() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
    editable: true,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        onCellDoubleClick={(params, event) => {
          if (!event.ctrlKey) {
            event.defaultMuiPrevented = true;
          }
        }}
        {...data}
        loading={loading}
      />
    </div>
  );
}

```

## Catalog of events

Expand the rows to see how to use each event.

```jsx
import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-pro';
import events from './events.json';

function getDataGridComponentNameFromProjectName(project) {
  switch (project) {
    case 'x-data-grid':
      return 'DataGrid';
    case 'x-data-grid-pro':
      return 'DataGridPro';
    case 'x-data-grid-premium':
      return 'DataGridPremium';
    default:
      throw new Error('Invalid grid project name');
  }
}

const Description = styled(Typography)({ whiteSpace: 'nowrap' });

function EventRow({ event }) {
  const example = React.useMemo(() => {
    const args = ['details, // GridCallbackDetails'];
    if (event.event) {
      args.unshift(`event,   // ${event.event}`);
    }
    if (event.params) {
      args.unshift(`params,  // ${event.params}`);
    }

    const propExample = event.componentProp
      ? `
// Component prop (available on ${event.projects
          .map(getDataGridComponentNameFromProjectName)
          .join(', ')})
<DataGrid
  ${event.componentProp}={handleEvent}
  {...other}
/>`
      : '';

    return `
const handleEvent: GridEventListener<'${event.name}'> = (
  ${args.join('\n  ')}
) => {...}

// Imperative subscription
apiRef.current.subscribeEvent(
  '${event.name}',
  handleEvent,
);

// Hook subscription (only available inside the scope of the grid)
useGridEvent(apiRef, '${event.name}', handleEvent);
${propExample}
`;
  }, [event]);

  return (
    <Box sx={{ px: 1 }}>
      <HighlightedCode code={example} language="tsx" />
    </Box>
  );
}

const COLUMNS = [
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    renderCell: ({ value }) => <code>{value}</code>,
  },
  {
    field: 'plan',
    headerName: 'Available on',
    width: 100,
    align: 'center',
    valueGetter: (value, row) => {
      if (row.projects.includes('x-data-grid')) {
        return 'x-data-grid';
      }
      if (row.projects.includes('x-data-grid-pro')) {
        return 'x-data-grid-pro';
      }
      if (row.projects.includes('x-data-grid-premium')) {
        return 'x-data-grid-premium';
      }
      return null;
    },
    renderCell: ({ value }) => {
      if (value === 'x-data-grid-pro') {
        return <span className="plan-pro" title="Pro plan" />;
      }
      if (value === 'x-data-grid-premium') {
        return <span className="plan-premium" title="Premium plan" />;
      }
      return '';
    },
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    renderCell: ({ value }) => (
      <Description
        variant="body2"
        style={{ whiteSpace: 'normal' }}
        dangerouslySetInnerHTML={{
          __html: value,
        }}
      />
    ),
  },
];

function Toolbar() {
  return (
    <GridToolbarContainer sx={{ p: 1 }}>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

export default function CatalogOfEventsNoSnap() {
  return (
    <DataGridPro
      disableColumnReorder
      autoHeight
      rows={events}
      columns={COLUMNS}
      getRowId={(row) => row.name}
      getDetailPanelContent={({ row }) => <EventRow event={row} />}
      getDetailPanelHeight={() => 'auto'}
      getRowHeight={() => 'auto'}
      disableRowSelection
      hideFooter
      slots={{
        toolbar: Toolbar,
      }}
      sx={{
        '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
        '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
        '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
      }}
    />
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
