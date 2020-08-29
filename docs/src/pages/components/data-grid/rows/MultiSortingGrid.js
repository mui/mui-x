import * as React from 'react';
import { XGrid } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

const sortModel = [
  {
    field: 'commodity',
    sort: 'asc',
  },
  {
    field: 'desk',
    sort: 'desc',
  },
];

export default function MultiSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid sortModel={sortModel} {...data} />
    </div>
  );
}
