import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { DataGridPro, gridRowSelectionIdsSelector } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SelectorInEventHandler() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const [selectedDesks, setSelectedDesks] = React.useState([]);

  const updateSelectedDesks = (details) => {
    // `details.api` is the same object as `apiRef.current`, so it can be passed
    // to any selector by wrapping it in a ref-shaped object: `{ current: details.api }`
    const apiRef = { current: details.api };
    const selectedRows = gridRowSelectionIdsSelector(apiRef);
    const desks = [...selectedRows.values()].map((row) => row?.desk).filter(Boolean);
    setSelectedDesks(desks);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataGridPro
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel, details) => {
          updateSelectedDesks(details);
        }}
        onFilterModelChange={(newFilterModel, details) => {
          updateSelectedDesks(details);
        }}
        {...data}
        sx={{ height: 400 }}
      />
      <Box
        sx={{
          mt: 1,
          p: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
          Selected desks:
        </Typography>
        {selectedDesks.length === 0 ? (
          <Typography variant="body2" color="text.disabled">
            None
          </Typography>
        ) : (
          selectedDesks.map((desk) => <Chip key={desk} label={desk} size="small" />)
        )}
      </Box>
    </Box>
  );
}
