import * as React from 'react';
import { DataGridPremium, frFR } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnMenuGridPro() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
      />
    </div>
  );
}
