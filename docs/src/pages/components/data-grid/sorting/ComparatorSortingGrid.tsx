import * as React from 'react';
import {
  GridColumns,
  DataGrid,
  GridValueGetterParams,
  gridNumberComparator,
  gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['rating', 'country', 'isAdmin'];

interface NameAdminCellValue {
  name: string;
  isAdmin: boolean;
}

export default function ComparatorSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const columns = React.useMemo<GridColumns>(
    () => [
      {
        field: 'nameAdmin',
        headerName: 'Name',
        valueGetter: (params: GridValueGetterParams) => ({
          name: params.row.name,
          isAdmin: params.row.isAdmin,
        }),
        renderCell: (params) => {
          if (params.value.isAdmin) {
            return `${params.value.name} (admin)`;
          }

          return params.value.name;
        },
        sortComparator: (v1, v2, param1, param2) => {
          const adminComparatorResult = gridNumberComparator(
            (v1 as NameAdminCellValue).isAdmin,
            (v2 as NameAdminCellValue).isAdmin,
            param1,
            param2,
          );

          if (adminComparatorResult !== 0) {
            return adminComparatorResult;
          }

          return gridStringOrNumberComparator(
            (v1 as NameAdminCellValue).name,
            (v2 as NameAdminCellValue).name,
            param1,
            param2,
          );
        },
        width: 200,
      },
      {
        field: 'dateCreatedCustom',
        valueGetter: (params) => params.row.dateCreated,
        headerName: 'Created on',
        width: 180,
        type: 'date',
        sortComparator: (v1, v2) => {
          return (v1 as Date).getDate() - (v2 as Date).getDate();
        },
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
          sorting: {
            sortModel: [
              {
                field: 'username',
                sort: 'asc',
              },
            ],
          },
        }}
      />
    </div>
  );
}
