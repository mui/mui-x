import * as React from 'react';
import { XGrid, SortDirection } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function MultiSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        sortModel={[
          {
            field: 'commodity',
            sort: 'asc' as SortDirection,
          },
          {
            field: 'desk',
            sort: 'desc' as SortDirection,
          },
        ]}
      />
    </div>
  );
}
