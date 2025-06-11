import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import ForwardIcon from '@mui/icons-material/Forward';
import ReplyIcon from '@mui/icons-material/Reply';
import {
  DataGridPro,
  useGridApiContext,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  useGridSelector,
  gridDimensionsSelector,
} from '@mui/x-data-grid-pro';
import { randomCreatedDate, randomEmail } from '@mui/x-data-grid-generator';

function DetailPanelContent({ row: rowProp }) {
  const apiRef = useGridApiContext();
  const width = useGridSelector(apiRef, gridDimensionsSelector).viewportInnerSize
    .width;

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
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 2 }}>
        <Stack direction="column" spacing={1}>
          <Typography variant="h5">{`Subject: ${rowProp.subject}`}</Typography>
          <Typography variant="caption">{`Date: ${rowProp.date.toLocaleString()}`}</Typography>
          <Typography variant="subtitle2">{`From: ${rowProp.name} <${rowProp.email}>`}</Typography>
          <Typography variant="subtitle2">{`To: me <${randomEmail()}>`}</Typography>

          <Typography variant="body2">
            Artisan bitters street art photo booth you probably have not heard of
            them slow-carb food truck. Meh narwhal tumeric bodega boys street art
            Brooklyn venmo. Kinfolk wolf iceland banjo, pitchfork cupping banh mi
            vexillologist cliche locavore venmo. Yuccie kombucha hashtag, bicycle
            rights umami truffaut mumblecore Brooklyn neutral milk hotel aesthetic.
            Wolf plaid leggings butcher solarpunk shabby chic cliche.
          </Typography>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <ButtonGroup variant="text" sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button sx={{ px: 2 }} startIcon={<ReplyIcon />}>
            Reply
          </Button>
          <Button sx={{ px: 2 }} startIcon={<ForwardIcon />}>
            Forward
          </Button>
          <Button sx={{ px: 2 }} color="error" startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </ButtonGroup>
      </Paper>
    </Stack>
  );
}

const columns = [
  { field: 'name', headerName: 'From' },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'subject', headerName: 'Subject', width: 300 },
  { field: 'date', type: 'date', headerName: 'Date' },
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

export default function MasterDetailEmailExample() {
  const getDetailPanelContent = React.useCallback(
    ({ row }) => <DetailPanelContent row={row} />,
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
