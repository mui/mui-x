import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function OrderSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        sortingOrder={['desc', 'asc']}
        initialState={{
          sorting: {
            sortModel: [
              {
                field: 'commodity',
                sort: 'asc',
              },
            ],
          },
        }}
        {...data}
      />
    </div>
  );
}
