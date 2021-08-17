import * as React from 'react';
import { XGrid } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function MultiSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'commodity',
      sort: 'asc',
    },
    {
      field: 'desk',
      sort: 'desc',
    },
  ]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <XGrid
        {...data}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
      />
    </div>
  );
}
