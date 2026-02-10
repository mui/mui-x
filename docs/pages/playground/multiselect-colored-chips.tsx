import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridMultiSelectCell,
  GridMultiSelectCellProps,
  GridEditMultiSelectCell,
  GridEditMultiSelectCellProps,
} from '@mui/x-data-grid-pro';
import { Box, ChipProps, Typography, Autocomplete, TextField } from '@mui/material';

type ChipColor = NonNullable<ChipProps['color']>;

const tagColorMap: Record<string, ChipColor> = {
  Bug: 'error',
  Feature: 'primary',
  Enhancement: 'info',
  Documentation: 'warning',
  Performance: 'success',
  Security: 'secondary',
  Refactor: 'default',
};

const tagOptions = Object.keys(tagColorMap);

const rows = [
  { id: 1, title: 'Fix login crash', tags: ['Bug', 'Security'] },
  { id: 2, title: 'Add dark mode', tags: ['Feature', 'Enhancement'] },
  { id: 3, title: 'Update API docs', tags: ['Documentation'] },
  { id: 4, title: 'Optimize queries', tags: ['Performance', 'Refactor'] },
  { id: 5, title: 'Add 2FA support', tags: ['Feature', 'Security'] },
  { id: 6, title: 'Fix memory leak', tags: ['Bug', 'Performance'] },
];

const getChipProps = (value: string) => ({
  color: tagColorMap[value] ?? ('default' as ChipColor),
  variant: 'filled' as ChipProps['variant'],
});

const columns: GridColDef[] = [
  // { field: 'title', headerName: 'Title', width: 200 },
  {
    field: 'tags',
    headerName: 'Tags',
    type: 'multiSelect',
    width: 300,
    editable: true,
    valueOptions: tagOptions,
    renderCell: (params) => (
      <GridMultiSelectCell
        {...(params as GridMultiSelectCellProps)}
        slotProps={{ chip: getChipProps }}
      />
    ),
    renderEditCell: (params) => (
      <GridEditMultiSelectCell
        {...(params as GridEditMultiSelectCellProps)}
        slotProps={{ chip: getChipProps }}
      />
    ),
  },
];

export default function MultiSelectColoredChips() {
  const [data, setData] = React.useState(rows);

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Recipe: Colored Chips (Notion-style)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Uses <code>slotProps.chip</code> as a function to map each tag value to a color. Preserves
        built-in autocompact and overflow popup behavior.
      </Typography>
      <Autocomplete
        options={['a', 'b', 'c']}
        multiple
        renderInput={(params) => <TextField {...params} />}
      />
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGridPro
          rows={data}
          columns={columns}
          processRowUpdate={(newRow) => {
            setData((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
            return newRow;
          }}
          autosizeOptions={{
            columns: ['tags'],
            includeOutliers: true,
          }}
        />
      </Box>
    </Box>
  );
}
