import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function InitialFilters() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        components={{
          Toolbar: GridToolbar,
        }}
        initialState={{
          ...data.initialState,
          filter: {
            filterModel: {
              items: [
                {
                  columnField: 'rating',
                  operatorValue: '>',
                  value: '2.5',
                },
              ],
            },
          },
        }}
      />
    </div>
  );
}
