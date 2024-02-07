import * as React from 'react';
import {
  GridColDef,
  DataGrid,
  gridNumberComparator,
  gridStringOrNumberComparator,
  GridComparatorFn,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['rating', 'country', 'dateCreated'];

interface NameAdminCellValue {
  name: string;
  isAdmin: boolean;
}

const nameAdminSortComparator: GridComparatorFn = (v1, v2, param1, param2) => {
  const adminComparatorResult = gridNumberComparator(
    (v1 as NameAdminCellValue).isAdmin,
    (v2 as NameAdminCellValue).isAdmin,
    param1,
    param2,
  );

  // The `isAdmin` values of the two cells are different
  // We can stop here and sort based on the `isAdmin` field.
  if (adminComparatorResult !== 0) {
    return adminComparatorResult;
  }

  return gridStringOrNumberComparator(
    (v1 as NameAdminCellValue).name,
    (v2 as NameAdminCellValue).name,
    param1,
    param2,
  );
};

export default function ExtendedSortComparator() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'nameAdmin',
        headerName: 'Name',
        valueGetter: (value, row) => ({
          name: row.name,
          isAdmin: row.isAdmin,
        }),
        valueFormatter: (value: NameAdminCellValue) => {
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
