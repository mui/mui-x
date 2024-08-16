import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ClipboardPaste() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 20,
    editable: true,
  });

  const initialState = {
    ...data.initialState,
    columns: {
      columnVisibilityModel: {
        id: false,
        desk: false,
      },
    },
  };

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        initialState={initialState}
        checkboxSelection
        disableRowSelectionOnClick
        ignoreValueFormatterDuringExport
        cellSelection
      />
    </div>
  );
}
