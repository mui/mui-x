import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const initialState = { pagination: { paginationModel: { pageSize: 10 } } };
const experimentalFeatures = { ariaV7: true };
const slots = { toolbar: GridToolbar };

export default function GridAriaV7() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        slots={slots}
        initialState={initialState}
        experimentalFeatures={experimentalFeatures}
      />
    </div>
  );
}
