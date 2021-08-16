import * as React from 'react';
import { XGrid } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function BasisPaginationGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid pagination pageSize={200} rowsPerPageOptions={[200]} {...data} />
    </div>
  );
}
