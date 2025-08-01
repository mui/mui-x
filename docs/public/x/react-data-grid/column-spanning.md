# Data Grid - Column spanning

Span cells across several columns.

By default, each cell takes up the width of one column.
You can modify this behavior with column spanning.
It allows cells to span multiple columns.
This is very close to the "column spanning" in an HTML `<table>`.

To change the number of columns a cell should span, use the `colSpan` property available in `GridColDef`:

```ts
interface GridColDef {
  /**
   * Number of columns a cell should span.
   * @default 1
   */
  colSpan?: number | ((params: GridCellParams<R, V, F>) => number | undefined);
  …
}
```

:::warning
When using `colSpan`, some other features may be pointless or may not work as expected (depending on the data model).
To avoid a confusing grid layout, consider disabling the following features for any columns that are affected by `colSpan`:

- [sorting](/x/react-data-grid/sorting/#disable-the-sorting)
- [filtering](/x/react-data-grid/filtering/#disable-the-filters)
- [column reorder](/x/react-data-grid/column-ordering/)
- [hiding columns](/x/react-data-grid/column-visibility/)
- [column pinning](/x/react-data-grid/column-pinning/#disabling-column-pinning)

:::

## Number signature

The number signature sets **all cells in the column** to span a given number of columns.

```ts
interface GridColDef {
  colSpan?: number;
}
```

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const other = {
  showCellVerticalBorder: true,
  showColumnVerticalBorder: true,
};

const rows = [
  { id: 1, username: '@MUI', age: 20 },
  { id: 2, username: '@MUI-X', age: 25 },
];

export default function ColumnSpanningNumber() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: 'fit-content',
      }}
    >
      <DataGrid
        columns={[
          { field: 'username', colSpan: 2, hideable: false },
          {
            field: 'organization',
            sortable: false,
            filterable: false,
            hideable: false,
          },
          { field: 'age', hideable: false },
        ]}
        rows={rows}
        {...other}
      />
    </div>
  );
}

```

## Function signature

The function signature allows spanning only **specific cells** in the column.
The function receives [`GridCellParams`](/x/api/data-grid/grid-cell-params/) as argument.

```ts
interface GridColDef {
  colSpan?: (params: GridCellParams<R, V, F>) => number | undefined;
}
```

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';

const items = [
  { id: 1, item: 'Paperclip', quantity: 100, price: 1.99 },
  { id: 2, item: 'Paper', quantity: 10, price: 30 },
  { id: 3, item: 'Pencil', quantity: 100, price: 1.25 },
];

type Item = (typeof items)[number];

interface SubtotalHeader {
  id: 'SUBTOTAL';
  label: string;
  subtotal: number;
}

interface TaxHeader {
  id: 'TAX';
  label: string;
  taxRate: number;
  taxTotal: number;
}

interface TotalHeader {
  id: 'TOTAL';
  label: string;
  total: number;
}

type Row = Item | SubtotalHeader | TaxHeader | TotalHeader;

const rows: Row[] = [
  ...items,
  { id: 'SUBTOTAL', label: 'Subtotal', subtotal: 624 },
  { id: 'TAX', label: 'Tax', taxRate: 10, taxTotal: 62.4 },
  { id: 'TOTAL', label: 'Total', total: 686.4 },
];

const baseColumnOptions = {
  sortable: false,
  pinnable: false,
  hideable: false,
};

const columns: GridColDef<Row>[] = [
  {
    field: 'item',
    headerName: 'Item/Description',
    ...baseColumnOptions,
    flex: 3,
    colSpan: (value, row) => {
      if (row.id === 'SUBTOTAL' || row.id === 'TOTAL') {
        return 3;
      }
      if (row.id === 'TAX') {
        return 2;
      }
      return undefined;
    },
    valueGetter: (value, row) => {
      if (row.id === 'SUBTOTAL' || row.id === 'TAX' || row.id === 'TOTAL') {
        return row.label;
      }
      return value;
    },
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    ...baseColumnOptions,
    flex: 1,
    sortable: false,
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1,
    ...baseColumnOptions,
    valueGetter: (value, row) => {
      if (row.id === 'TAX') {
        return `${row.taxRate}%`;
      }
      return value;
    },
  },
  {
    field: 'total',
    headerName: 'Total',
    flex: 1,
    ...baseColumnOptions,
    valueGetter: (value, row) => {
      if (row.id === 'SUBTOTAL') {
        return row.subtotal;
      }
      if (row.id === 'TAX') {
        return row.taxTotal;
      }
      if (row.id === 'TOTAL') {
        return row.total;
      }
      return row.price * row.quantity;
    },
  },
];

const getCellClassName: DataGridProps['getCellClassName'] = ({ row, field }) => {
  if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
    if (field === 'item') {
      return 'bold';
    }
  }
  return '';
};

export default function ColumnSpanningFunction() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        '& .bold': {
          fontWeight: 600,
        },
      }}
    >
      <DataGrid
        disableColumnFilter
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        getCellClassName={getCellClassName}
        columns={columns}
        rows={rows}
      />
    </Box>
  );
}

```

Function signature can also be useful to derive `colSpan` value from row data:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';

const slotTimesLookup = {
  0: '09:00 - 10:00',
  1: '10:00 - 11:00',
  2: '11:00 - 12:00',
  3: '12:00 - 13:00',
  4: '13:00 - 14:00',
  5: '14:00 - 15:00',
  6: '15:00 - 16:00',
  7: '16:00 - 17:00',
};

type Subject =
  | 'Maths'
  | 'English'
  | 'Lab'
  | 'Chemistry'
  | 'Physics'
  | 'Music'
  | 'Dance';

type Row = { id: number; day: string; slots: Array<Subject | ''> };

const rows: Array<Row> = [
  {
    id: 1,
    day: 'Monday',
    slots: ['Maths', 'English', 'English', 'Lab', '', 'Lab', 'Music', 'Music'],
  },
  {
    id: 2,
    day: 'Tuesday',
    slots: [
      'Chemistry',
      'Chemistry',
      'Chemistry',
      'Physics',
      '',
      'Maths',
      'Lab',
      'Dance',
    ],
  },
  {
    id: 3,
    day: 'Wednesday',
    slots: ['Physics', 'English', 'Maths', 'Maths', '', 'Chemistry', 'Chemistry'],
  },
  {
    id: 4,
    day: 'Thursday',
    slots: [
      'Music',
      'Music',
      'Chemistry',
      'Chemistry',
      '',
      'Chemistry',
      'English',
      'English',
    ],
  },
  {
    id: 5,
    day: 'Friday',
    slots: ['Maths', 'Dance', 'Dance', 'Physics', '', 'English'],
  },
];

const slotColumnCommonFields: Partial<GridColDef> = {
  sortable: false,
  filterable: false,
  pinnable: false,
  hideable: false,
  minWidth: 140,
  cellClassName: (params) => params.value,
  colSpan: (value, row, column) => {
    const index = Number(column.field);
    let colSpan = 1;
    for (let i = index + 1; i < row.slots.length; i += 1) {
      const nextValue = row.slots[i];
      if (nextValue === value) {
        colSpan += 1;
      } else {
        break;
      }
    }
    return colSpan;
  },
};

const columns: GridColDef<Row>[] = [
  {
    field: 'day',
    headerName: 'Day',
  },
  {
    field: '0',
    headerName: slotTimesLookup[0],
    valueGetter: (value, row) => row.slots[0],
    ...slotColumnCommonFields,
  },
  {
    field: '1',
    headerName: slotTimesLookup[1],
    valueGetter: (value, row) => row.slots[1],
    ...slotColumnCommonFields,
  },
  {
    field: '2',
    headerName: slotTimesLookup[2],
    valueGetter: (value, row) => row.slots[2],
    ...slotColumnCommonFields,
  },
  {
    field: '3',
    headerName: slotTimesLookup[3],
    valueGetter: (value, row) => row.slots[3],
    ...slotColumnCommonFields,
  },
  {
    field: '4',
    headerName: slotTimesLookup[4],
    valueGetter: (value, row) => row.slots[4],
    ...slotColumnCommonFields,
  },
  {
    field: '5',
    headerName: slotTimesLookup[5],
    valueGetter: (value, row) => row.slots[5],
    ...slotColumnCommonFields,
  },
  {
    field: '6',
    headerName: slotTimesLookup[6],
    valueGetter: (value, row) => row.slots[6],
    ...slotColumnCommonFields,
  },
  {
    field: '7',
    headerName: slotTimesLookup[7],
    valueGetter: (value, row) => row.slots[7],
    ...slotColumnCommonFields,
  },
];

const rootStyles = {
  display: 'flex',
  flexDirection: 'column',
  height: 'fit-content',
  width: '100%',
  '& .Maths': {
    backgroundColor: 'rgba(157, 255, 118, 0.49)',
  },
  '& .English': {
    backgroundColor: 'rgba(255, 255, 10, 0.49)',
  },
  '& .Lab': {
    backgroundColor: 'rgba(150, 150, 150, 0.49)',
  },
  '& .Chemistry': {
    backgroundColor: 'rgba(255, 150, 150, 0.49)',
  },
  '& .Physics': {
    backgroundColor: 'rgba(10, 150, 255, 0.49)',
  },
  '& .Music': {
    backgroundColor: 'rgba(224, 183, 60, 0.55)',
  },
  '& .Dance': {
    backgroundColor: 'rgba(200, 150, 255, 0.49)',
  },
};

export default function ColumnSpanningDerived() {
  return (
    <Box sx={rootStyles}>
      <DataGridPro
        columns={columns}
        rows={rows}
        initialState={{
          pinnedColumns: {
            left: ['day'],
          },
        }}
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnReorder
      />
    </Box>
  );
}

```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
