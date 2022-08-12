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
