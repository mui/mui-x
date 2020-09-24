import * as React from 'react';
import { XGrid, SortDirection } from '@material-next/x-grid';
import { useDemoData } from '@material-next/x-grid-data-generator';

const sortModel = [
  {
    field: 'commodity',
    sort: 'asc' as SortDirection,
  },
  {
    field: 'desk',
    sort: 'desc' as SortDirection,
  },
];

export default function MultiSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid sortModel={sortModel} {...data} />
    </div>
  );
}
