import * as React from 'react';
import { GridColDef, DataGrid, GridComparatorFn } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['name', 'rating', 'country', 'isAdmin'];

const dayInMonthComparator: GridComparatorFn<Date> = (v1, v2) =>
  v1.getDate() - v2.getDate();

export default function FullyCustomSortComparator() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'dateCreatedCustom',
        valueGetter: (value, row) => row.dateCreated,
        headerName: 'Created on',
        width: 180,
        type: 'date',
        sortComparator: dayInMonthComparator,
      },
      ...data.columns,
    ],
    [data.columns],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        columns={columns}
        initialState={{
          ...data.initialState,
          sorting: {
            ...data.initialState?.sorting,
            sortModel: [
              {
                field: 'dateCreatedCustom',
                sort: 'asc',
              },
            ],
          },
        }}
      />
    </div>
  );
}
