import * as React from 'react';
import {
  DataGrid,
  gridNumberComparator,
  gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

const VISIBLE_FIELDS = ['rating', 'country', 'isAdmin'];

export default function ComparatorSortingGrid() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });

  const [sortModel, setSortModel] = React.useState([
    {
      field: 'username',
      sort: 'asc',
    },
  ]);

  const columns = React.useMemo(
    () => [
      {
        field: 'nameAdmin',
        headerName: 'Name',
        valueGetter: (params) => ({
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
            v1.isAdmin,
            v2.isAdmin,
            param1,
            param2,
          );

          if (adminComparatorResult !== 0) {
            return adminComparatorResult;
          }

          return gridStringOrNumberComparator(v1.name, v2.name, param1, param2);
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
          return v1.getDate() - v2.getDate();
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
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
      />
    </div>
  );
}
