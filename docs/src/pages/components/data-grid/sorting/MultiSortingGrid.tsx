import * as React from 'react';
import { XGrid, GridSortDirection, GridSortModel } from '@material-ui/x-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function MultiSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'commodity',
      sort: 'asc' as GridSortDirection,
    },
    {
      field: 'desk',
      sort: 'desc' as GridSortDirection,
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
