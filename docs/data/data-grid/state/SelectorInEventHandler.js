import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { DataGrid, gridRowSelectionIdsSelector } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SelectorInEventHandler() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const [message, setMessage] = React.useState('');

  const handleFilterModelChange = (model, details) => {
    // The row selection is not part of the callback arguments,
    // but it can be read from the state through `details.apiRef`
    const selectedRows = gridRowSelectionIdsSelector(details.apiRef);
    const desks = [...selectedRows.values()].map((row) => row?.desk).filter(Boolean);

    if (selectedRows.size === 0) {
      setMessage('Filter changed with no rows selected');
    } else {
      setMessage(
        `Filter changed with ${selectedRows.size} selected row(s): ${desks.join(', ')}`,
      );
    }
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          {...data}
          checkboxSelection
          showToolbar
          onFilterModelChange={handleFilterModelChange}
        />
      </Box>
      {message && <Alert severity="info">{message}</Alert>}
    </Stack>
  );
}
