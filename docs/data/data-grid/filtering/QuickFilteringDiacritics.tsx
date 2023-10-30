import * as React from 'react';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const rows = [{ id: 0, value: 'Café' }];
const columns: GridColDef[] = [{ field: 'value', width: 150 }];

export default function QuickFilteringDiacritics() {
  const [ignoreDiacritics, setIgnoreDiacritics] = React.useState(true);

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        checked={ignoreDiacritics}
        onChange={(event) =>
          setIgnoreDiacritics((event.target as HTMLInputElement).checked)
        }
        control={<Switch color="primary" size="small" />}
        label="Ignore diacritics"
      />
      <div style={{ height: 200, width: '100%' }}>
        <DataGrid
          key={ignoreDiacritics.toString()}
          rows={rows}
          columns={columns}
          initialState={{
            filter: {
              filterModel: { items: [], quickFilterValues: ['cafe'] },
            },
          }}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          hideFooter
          slots={{ toolbar: GridToolbar }}
          slotProps={{ toolbar: { showQuickFilter: true } }}
          ignoreDiacriticsInFiltering={ignoreDiacritics}
        />
      </div>
    </div>
  );
}
