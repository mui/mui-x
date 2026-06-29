import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import {
  DataGridPro,
  GridCallbackDetails,
  GridFilterModel,
  GridRowSelectionModel,
  gridRowSelectionIdsSelector,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SelectorInEventHandler() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const [selectedDesks, setSelectedDesks] = React.useState<string[]>([]);

  const updateSelectedDesks = (details: GridCallbackDetails) => {
    const selectedRows = gridRowSelectionIdsSelector(details.apiRef);
    const desks = [...selectedRows.values()].map((row) => row?.desk).filter(Boolean);
    setSelectedDesks(desks);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataGridPro
        checkboxSelection
        onRowSelectionModelChange={(
          newRowSelectionModel: GridRowSelectionModel,
          details: GridCallbackDetails,
        ) => {
          updateSelectedDesks(details);
        }}
        onFilterModelChange={(
          newFilterModel: GridFilterModel,
          details: GridCallbackDetails,
        ) => {
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
