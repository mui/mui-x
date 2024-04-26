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
useGridApiEventHandler(apiRef, '${event.name}', handleEvent);
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
