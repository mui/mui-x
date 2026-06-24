import * as React from 'react';
import {
  DataGridPro,
  gridFilterModelSelector,
  gridRowSelectionIdsSelector,
} from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function RowSelectionFromCallback() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const logSelectionAndFilter = (details) => {
    // `details.api` is the same object as `apiRef.current`, so it can be passed
    // to any selector by wrapping it in a ref-shaped object: `{ current: details.api }`
    const apiRef = { current: details.api };
    console.log('selected rows:', gridRowSelectionIdsSelector(apiRef));
    console.log('filter model:', gridFilterModelSelector(apiRef));
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel, details) => {
          logSelectionAndFilter(details);
        }}
        onFilterModelChange={(newFilterModel, details) => {
          logSelectionAndFilter(details);
        }}
        {...data}
      />
    </div>
  );
}
