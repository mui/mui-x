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
