import * as React from 'react';
import { DataGrid, GridSortDirection, GridSortModel } from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';

export default function BasicSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'commodity',
      sort: 'asc' as GridSortDirection,
    },
  ]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
      />
    </div>
  );
}
