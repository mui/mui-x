import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function SimpleHeaderFilteringDataGridPro() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        initialState={{
          ...data.initialState,
          columns: {
            columnVisibilityModel: {
              avatar: false,
              id: false,
            },
          },
        }}
        disableColumnFilter
        headerFilters
        slots={{
          headerFilterMenu: null,
        }}
      />
    </div>
  );
}
