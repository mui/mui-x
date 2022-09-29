import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function OrderSortingPerColumnGrid() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () =>
      data.columns.map((column) => {
        if (column.field === 'rating') {
          return {
            ...column,
            sortingOrder: ['desc', 'asc', null],
          };
        }

        return column;
      }),
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} columns={columns} sortingOrder={['asc', 'desc', null]} />
    </div>
  );
}
