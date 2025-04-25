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
