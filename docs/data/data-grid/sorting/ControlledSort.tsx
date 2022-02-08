import * as React from 'react';
import { DataGrid, GridSortModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function ControlledSort() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: 'rating',
      sort: 'desc',
    },
  ]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
      />
    </div>
  );
}
