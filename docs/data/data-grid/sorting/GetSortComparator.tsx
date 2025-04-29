import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import {
  randomQuantity,
  randomId,
  randomCommodity,
} from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: 'commodity', headerName: 'Commodity', width: 200 },
  {
    type: 'number',
    field: 'quantity',
    headerName: 'Quantity',
    getSortComparator: (sortDirection) => {
      const modifier = sortDirection === 'desc' ? -1 : 1;
      return (value1, value2, cellParams1, cellParams2) => {
        if (value1 === null) {
          return 1;
        }
        if (value2 === null) {
          return -1;
        }
        return (
          modifier *
          gridStringOrNumberComparator(value1, value2, cellParams1, cellParams2)
        );
      };
    },
  },
];

const rows = [
  { id: randomId(), commodity: randomCommodity(), quantity: randomQuantity() },
  { id: randomId(), commodity: randomCommodity(), quantity: null },
  { id: randomId(), commodity: randomCommodity(), quantity: randomQuantity() },
  { id: randomId(), commodity: randomCommodity(), quantity: null },
  { id: randomId(), commodity: randomCommodity(), quantity: randomQuantity() },
];

export default function GetSortComparator() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
