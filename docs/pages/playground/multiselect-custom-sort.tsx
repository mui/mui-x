import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridComparatorFn,
} from '@mui/x-data-grid-pro';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

const tagOptions = ['React', 'Angular', 'Vue', 'Svelte', 'Node.js', 'Python', 'Go'];

const rows = [
  { id: 1, name: 'Alice', tags: ['React', 'Node.js', 'Python'] },
  { id: 2, name: 'Bob', tags: ['Angular'] },
  { id: 3, name: 'Charlie', tags: ['Vue', 'Go'] },
  { id: 4, name: 'Diana', tags: ['React', 'Svelte', 'Vue', 'Node.js'] },
  { id: 5, name: 'Eve', tags: [] },
  { id: 6, name: 'Frank', tags: ['Python', 'Go'] },
];

const sortByLength: GridComparatorFn = (v1, v2) =>
  (v1?.length ?? 0) - (v2?.length ?? 0);

const sortAlphabetically: GridComparatorFn = (v1, v2) => {
  const a = Array.isArray(v1) ? [...v1].sort().join(', ') : '';
  const b = Array.isArray(v2) ? [...v2].sort().join(', ') : '';
  return a.localeCompare(b);
};

const sortByFirstValue: GridComparatorFn = (v1, v2) => {
  const a = Array.isArray(v1) && v1.length > 0 ? String(v1[0]) : '';
  const b = Array.isArray(v2) && v2.length > 0 ? String(v2[0]) : '';
  return a.localeCompare(b);
};

const comparators: Record<string, GridComparatorFn> = {
  length: sortByLength,
  alphabetical: sortAlphabetically,
  firstValue: sortByFirstValue,
};

export default function MultiSelectCustomSort() {
  const [data, setData] = React.useState(rows);
  const [sortMode, setSortMode] = React.useState('length');

  const columns: GridColDef[] = React.useMemo(
    () => [
      { field: 'name', headerName: 'Name', width: 120 },
      {
        field: 'tags',
        headerName: 'Tags',
        type: 'multiSelect',
        width: 300,
        editable: true,
        valueOptions: tagOptions,
        sortComparator: comparators[sortMode],
      },
    ],
    [sortMode],
  );

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Recipe: Custom Sort Comparator
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Override <code>sortComparator</code> to change how multiSelect columns are sorted.
      </Typography>
      <ToggleButtonGroup
        value={sortMode}
        exclusive
        onChange={(_, v) => v && setSortMode(v)}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="length">By count (default)</ToggleButton>
        <ToggleButton value="alphabetical">Alphabetical (joined)</ToggleButton>
        <ToggleButton value="firstValue">By first value</ToggleButton>
      </ToggleButtonGroup>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGridPro
          rows={data}
          columns={columns}
          initialState={{ sorting: { sortModel: [{ field: 'tags', sort: 'asc' }] } }}
          processRowUpdate={(newRow) => {
            setData((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
            return newRow;
          }}
        />
      </Box>
    </Box>
  );
}
