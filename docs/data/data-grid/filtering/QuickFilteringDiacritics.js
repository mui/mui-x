import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const rows = [
  { id: 0, string: 'Café', date: new Date(2023, 1, 1), singleSelect: 'Jalapeño' },
];

const columns = [
  { field: 'string', width: 100 },
  {
    field: 'date',
    type: 'date',
    width: 150,
    valueFormatter: (value) => dateFormatter.format(value),
  },
  {
    field: 'singleSelect',
    type: 'singleSelect',
    valueOptions: ['Jalapeño'],
  },
];

export default function QuickFilteringDiacritics() {
  const [filterModel, setFilterModel] = React.useState({
    items: [],
    quickFilterValues: ['cafe'],
  });
  const [ignoreDiacritics, setIgnoreDiacritics] = React.useState(true);

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        checked={ignoreDiacritics}
        onChange={(event) => setIgnoreDiacritics(event.target.checked)}
        control={<Switch />}
        label="Ignore diacritics"
      />
      <div style={{ height: 200, width: '100%' }}>
        <DataGrid
          key={ignoreDiacritics.toString()}
          rows={rows}
          columns={columns}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          disableColumnSelector
          disableDensitySelector
          hideFooter
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          ignoreDiacritics={ignoreDiacritics}
        />
      </div>
    </div>
  );
}
