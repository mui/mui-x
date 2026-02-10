import * as React from 'react';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { Box, Typography } from '@mui/material';

const MAX_TAGS = 3;

const tagOptions = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'Go',
  'Rust',
  'Docker',
];

const rows = [
  { id: 1, name: 'Project Alpha', tags: ['React', 'TypeScript'] },
  { id: 2, name: 'Project Beta', tags: ['Node.js', 'Python', 'Docker'] },
  { id: 3, name: 'Project Gamma', tags: ['Go'] },
  { id: 4, name: 'Project Delta', tags: [] },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  {
    field: 'tags',
    headerName: `Tags (max ${MAX_TAGS})`,
    type: 'multiSelect',
    width: 300,
    editable: true,
    valueOptions: tagOptions,
    preProcessEditCellProps: (params) => {
      const value = params.props.value as string[] | undefined;
      const hasError = Array.isArray(value) && value.length > MAX_TAGS;
      return { ...params.props, error: hasError };
    },
  },
];

export default function MultiSelectLimitSelections() {
  const [data, setData] = React.useState(rows);

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Recipe: Limit Max Selections
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Uses <code>preProcessEditCellProps</code> to validate that no more than {MAX_TAGS} tags are
        selected. The cell shows an error state when the limit is exceeded.
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGridPro
          rows={data}
          columns={columns}
          processRowUpdate={(newRow) => {
            setData((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
            return newRow;
          }}
          onProcessRowUpdateError={(error) => console.error(error)}
        />
      </Box>
    </Box>
  );
}
