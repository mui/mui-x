import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {
  DataGridPro,
  GridColDef,
  useGridApiContext,
  GridRowParams,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GridDimensions,
} from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomEmail,
} from '@mui/x-data-grid-generator';

const getDetailPanelWidth = (gridDimensions: GridDimensions) => {
  return gridDimensions.viewportInnerSize.width;
};

function DetailPanelContent({ row: rowProp }: { row: Customer }) {
  const apiRef = useGridApiContext();
  const [width, setWidth] = React.useState(() =>
    getDetailPanelWidth(apiRef.current.getRootDimensions()),
  );

  const handleViewportInnerSizeChange = React.useCallback(() => {
    setWidth(getDetailPanelWidth(apiRef.current.getRootDimensions()));
  }, [apiRef]);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent(
      'viewportInnerSizeChange',
      handleViewportInnerSizeChange,
    );
  }, [apiRef, handleViewportInnerSizeChange]);

  return (
    <Stack
      sx={{
        py: 2,
        height: '100%',
        boxSizing: 'border-box',
        position: 'sticky',
        left: 0,
        width,
      }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1.5}>
          <Typography variant="h5">{`Subject: ${rowProp.subject}`}</Typography>
          <span>{`Date: ${rowProp.date.toLocaleString()}`}</span>
          <span>{`From: ${rowProp.name} <${rowProp.email}>`}</span>
          <span>{`To: me <${randomEmail()}>`}</span>

          <p>Artisan bitters street art photo booth you probably haven't heard of them slow-carb food truck. Meh narwhal tumeric bodega boys street art Brooklyn venmo. Kinfolk wolf iceland banjo, pitchfork cupping banh mi vexillologist cliche locavore venmo. Yuccie kombucha hashtag, bicycle rights umami truffaut mumblecore Brooklyn neutral milk hotel aesthetic. Wolf plaid lumbersexual leggings butcher solarpunk shabby chic cliche.</p>

          <ButtonGroup variant="outlined" fullWidth>
            <Button>Reply</Button>
            <Button>Forward</Button>
            <Button>Delete</Button>
          </ButtonGroup>
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'From' },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'subject', headerName: 'Subject', width: 300 },
  { field: 'date', type: 'date', headerName: 'Time' },
];

const rows = [
  {
    id: 1,
    name: 'Matheus',
    email: randomEmail(),
    subject: 'Readymade asymmetrical organic salad',
    date: randomCreatedDate(),
  },
  {
    id: 2,
    name: 'Olivier',
    email: randomEmail(),
    subject: 'Chillwave solarpunk grailed waistcoat ramps',
    date: randomCreatedDate(),
  },
  {
    id: 3,
    name: 'Flavien',
    email: randomEmail(),
    subject: 'Williamsburg ugh YOLO',
    date: randomCreatedDate(),
  },
  {
    id: 4,
    name: 'Danail',
    email: randomEmail(),
    subject: 'Humblebrag la croix hexagon big mood',
    date: randomCreatedDate(),
  },
  {
    id: 5,
    name: 'Alexandre',
    email: randomEmail(),
    subject: 'Vinyl chambray kitsch',
    date: randomCreatedDate(),
  },
  {
    id: 6,
    name: 'José',
    email: randomEmail(),
    subject: 'Hella kogi pour-over wolf',
    date: randomCreatedDate(),
  },
];

type Customer = (typeof rows)[number];

export default function MasterDetailEmailExample() {
  const getDetailPanelContent = React.useCallback(
    ({ row }: GridRowParams) => <DetailPanelContent row={row} />,
    [],
  );

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        initialState={{
          pinnedColumns: {
            left: [GRID_DETAIL_PANEL_TOGGLE_FIELD],
          },
        }}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
        sx={{
          '& .MuiDataGrid-detailPanel': {
            overflow: 'visible',
          },
        }}
      />
    </Box>
  );
}
