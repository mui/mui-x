import * as React from 'react';
import { DataGridPremium, GridToolbar } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnSelectorGridToggleAllMode() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          columnsManagement: {
            toggleAllMode: 'filteredOnly',
          },
        }}
      />
    </div>
  );
}
