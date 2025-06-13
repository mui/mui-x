import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function InitialFilters() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        showToolbar
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [
                {
                  field: 'rating',
                  operator: '>',
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
