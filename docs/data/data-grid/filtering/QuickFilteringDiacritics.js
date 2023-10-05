import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const rows = [{ id: 0, value: 'Café' }];

export default function QuickFilteringDiacritics() {
  const [ignoreDiacritics, setIgnoreDiacritics] = React.useState(true);

  const columns = React.useMemo(() => {
    return [{ field: 'value', width: 150, ignoreDiacritics }];
  }, [ignoreDiacritics]);

  return (
    <div style={{ width: '100%' }}>
      <FormControlLabel
        checked={ignoreDiacritics}
        onChange={(event) => setIgnoreDiacritics(event.target.checked)}
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
        />
      </div>
    </div>
  );
}
