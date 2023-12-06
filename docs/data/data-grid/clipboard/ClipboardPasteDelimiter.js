import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ClipboardPasteDelimiter() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
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
        disableRowSelectionOnClick
        ignoreValueFormatterDuringExport
        cellSelection
        clipboardCopyCellDelimiter={','}
        splitClipboardPastedText={(text) =>
          text.split('\n').map((row) => row.split(','))
        }
      />
    </div>
  );
}
