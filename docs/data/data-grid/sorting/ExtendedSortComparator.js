import * as React from 'react';
import {
  DataGrid,
  gridNumberComparator,
  gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['rating', 'country', 'dateCreated'];

const nameAdminSortComparator = (v1, v2, param1, param2) => {
  const adminComparatorResult = gridNumberComparator(
    v1.isAdmin,
    v2.isAdmin,
    param1,
    param2,
  );

  // The `isAdmin` values of the two cells are different
  // We can stop here and sort based on the `isAdmin` field.
  if (adminComparatorResult !== 0) {
    return adminComparatorResult;
  }

  return gridStringOrNumberComparator(v1.name, v2.name, param1, param2);
};

export default function ExtendedSortComparator() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo(
    () => [
      {
        field: 'nameAdmin',
        headerName: 'Name',
        valueGetter: (value, row) => ({
          name: row.name,
          isAdmin: row.isAdmin,
        }),
        valueFormatter: (value) => {
          if (value.isAdmin) {
            return `${value.name} (admin)`;
          }

          return value.name;
        },
        sortComparator: nameAdminSortComparator,
        width: 200,
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
                field: 'nameAdmin',
                sort: 'asc',
              },
            ],
          },
        }}
      />
    </div>
  );
}
