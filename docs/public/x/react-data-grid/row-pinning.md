---
title: Data Grid - Row pinning
---

# Data Grid - Row pinning [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Implement pinning to keep rows in the Data Grid visible at all times.

Pinned rows (also known as sticky, frozen, and locked) are visible at all times while scrolling the Data Grid vertically.
With the Data Grid Pro, you can pin rows to the top or bottom of the grid.

## Implementing row pinning

Use the `pinnedRows` prop to define the rows to be pinned to the `top` or `bottom` of the Data Grid, as shown below:

```tsx
const pinnedRows: GridPinnedRowsProp = {
  top: [{ id: 0, brand: 'Nike' }],
  bottom: [
    { id: 1, brand: 'Adidas' },
    { id: 2, brand: 'Puma' },
  ],
};

<DataGridPro pinnedRows={pinnedRows} />;
```

### Pinned row data formatting

The data format for pinned rows is the same as for the `rows` prop (see [Feeding data](/x/react-data-grid/row-definition/#feeding-data)).

Pinned rows data should also meet [Row identifier](/x/react-data-grid/row-definition/#row-identifier) requirements.

```tsx
import * as React from 'react';
import { DataGridPro, GridPinnedRowsProp, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomCity,
  randomEmail,
  randomId,
  randomInt,
  randomTraderName,
  randomUserName,
} from '@mui/x-data-grid-generator';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'username', headerName: 'Username' },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'age', type: 'number', headerName: 'Age' },
];

const rows: object[] = [];

function getRow() {
  return {
    id: randomId(),
    name: randomTraderName(),
    city: randomCity(),
    username: randomUserName(),
    email: randomEmail(),
    age: randomInt(10, 80),
  };
}

for (let i = 0; i < 10; i += 1) {
  rows.push(getRow());
}

const pinnedRows: GridPinnedRowsProp = {
  top: [getRow(), getRow()],
  bottom: [getRow()],
};

export default function RowPinning() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPro columns={columns} rows={rows} pinnedRows={pinnedRows} />
    </div>
  );
}

```

:::warning
As with the `rows` prop, `pinnedRows` should keep the same reference between two renders.
Otherwise the Data Grid will reapply heavy work like sorting and filtering.
:::

## Controlling pinned rows

You can control which rows are pinned by making dynamic changes to `pinnedRows`.

The demo below uses the `actions` column type to provide buttons that let the user pin a row to the top or bottom of the Grid.

```tsx
import * as React from 'react';
import {
  DataGridPro,
  GridRowModel,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid-pro';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownIcon from '@mui/icons-material/ArrowDownward';
import Tooltip from '@mui/material/Tooltip';
import {
  randomId,
  randomTraderName,
  randomCity,
  randomUserName,
  randomEmail,
} from '@mui/x-data-grid-generator';

const data: GridRowModel[] = [];

function getRow() {
  return {
    id: randomId(),
    name: randomTraderName(),
    city: randomCity(),
    username: randomUserName(),
    email: randomEmail(),
  };
}

for (let i = 0; i < 20; i += 1) {
  data.push(getRow());
}

export default function RowPinningWithActions() {
  const [pinnedRowsIds, setPinnedRowsIds] = React.useState<{
    top: GridRowId[];
    bottom: GridRowId[];
  }>({
    top: [],
    bottom: [],
  });

  const { rows, pinnedRows } = React.useMemo(() => {
    const rowsData: GridRowModel[] = [];
    const pinnedRowsData: { top: GridRowModel[]; bottom: GridRowModel[] } = {
      top: [],
      bottom: [],
    };

    data.forEach((row) => {
      if (pinnedRowsIds.top.includes(row.id)) {
        pinnedRowsData.top.push(row);
      } else if (pinnedRowsIds.bottom.includes(row.id)) {
        pinnedRowsData.bottom.push(row);
      } else {
        rowsData.push(row);
      }
    });

    return {
      rows: rowsData,
      pinnedRows: pinnedRowsData,
    };
  }, [pinnedRowsIds]);

  const columns = React.useMemo<GridColDef<(typeof data)[number]>[]>(
    () => [
      {
        field: 'actions',
        type: 'actions',
        width: 100,
        getActions: (params) => {
          const isPinnedTop = pinnedRowsIds.top.includes(params.id);
          const isPinnedBottom = pinnedRowsIds.bottom.includes(params.id);
          if (isPinnedTop || isPinnedBottom) {
            return [
              <GridActionsCellItem
                label="Unpin"
                icon={
                  <Tooltip title="Unpin">
                    {isPinnedTop ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  </Tooltip>
                }
                onClick={() =>
                  setPinnedRowsIds((prevPinnedRowsIds) => ({
                    top: prevPinnedRowsIds.top.filter(
                      (rowId) => rowId !== params.id,
                    ),
                    bottom: prevPinnedRowsIds.bottom.filter(
                      (rowId) => rowId !== params.id,
                    ),
                  }))
                }
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={
                <Tooltip title="Pin at the top">
                  <ArrowUpIcon />
                </Tooltip>
              }
              label="Pin at the top"
              onClick={() =>
                setPinnedRowsIds((prevPinnedRowsIds) => ({
                  ...prevPinnedRowsIds,
                  top: [...prevPinnedRowsIds.top, params.id],
                }))
              }
            />,
            <GridActionsCellItem
              icon={
                <Tooltip title="Pin at the bottom">
                  <ArrowDownIcon />
                </Tooltip>
              }
              label="Pin at the bottom"
              onClick={() =>
                setPinnedRowsIds((prevPinnedRowsIds) => ({
                  ...prevPinnedRowsIds,
                  bottom: [...prevPinnedRowsIds.bottom, params.id],
                }))
              }
            />,
          ];
        },
      },
      { field: 'name', headerName: 'Name', width: 150 },
      { field: 'city', headerName: 'City', width: 150 },
      { field: 'username', headerName: 'Username' },
      { field: 'email', headerName: 'Email', width: 200 },
    ],
    [pinnedRowsIds],
  );

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPro columns={columns} pinnedRows={pinnedRows} rows={rows} />
    </div>
  );
}

```

## Usage with other features

Pinned rows are not affected by sorting, filtering, or pagination—they remain pinned regardless of how these features are applied.

```tsx
import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function RowPinningWithPagination() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 20,
    editable: true,
  });

  const rowsData = React.useMemo(() => {
    if (!data.rows || data.rows.length === 0) {
      return { rows: data.rows };
    }
    const [firstRow, secondRow, thirdRow, ...rows] = data.rows;
    return {
      rows,
      pinnedRows: {
        top: [firstRow],
        bottom: [secondRow, thirdRow],
      },
    };
  }, [data.rows]);

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPro
        {...data}
        loading={loading}
        rows={rowsData.rows}
        pinnedRows={rowsData.pinnedRows}
        initialState={{
          ...data.initialState,
          pagination: {
            ...data.initialState?.pagination,
            paginationModel: { pageSize: 25 },
          },
        }}
        pagination
        pageSizeOptions={[5, 10, 25, 50, 100]}
      />
    </div>
  );
}

```

Pinned rows do not support the following features:

- selection
- row grouping
- tree data
- row reordering
- master-detail row panels

When there are pinned rows present in a Grid, you can still use these features with rows that aren't pinned.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
