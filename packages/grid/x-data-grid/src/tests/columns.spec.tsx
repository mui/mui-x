import * as React from 'react';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import type { Expect, Equal } from 'test/utils/typeUtils';
import { GridCellParams } from '../models/params/gridCellParams';
import { GridColDef, GridRowParams } from '../models';

function RenderCellParamsExplicitTyping() {
  return (
    <DataGrid
      rows={[]}
      columns={[
        {
          field: 'price1',
          renderCell: (params: GridRenderCellParams) => {
            return params.value.toUpperCase();
          },
        },
        {
          field: 'price2',
          renderCell: (params: GridRenderCellParams<any, any, number>) => {
            return params.value.toUpperCase();
          },
        },
        {
          field: 'price3',
          renderCell: (params: GridRenderCellParams) => {
            return params.row.price.toUpperCase();
          },
        },
        {
          field: 'price4',
          renderCell: (params: GridRenderCellParams<any, { price: number }>) => {
            return params.row.price.toUpperCase();
          },
        },
        {
          field: 'price5',
          renderCell: (params: GridRenderCellParams<any, any, number>) => {
            // @ts-expect-error `toUpperCase` doesn't exist in number
            return params.formattedValue.toUpperCase();
          },
        },
        {
          field: 'price6',
          type: 'actions',
          getActions: (params: GridRowParams<{ price: string }>) => {
            // @ts-expect-error Property tax does not exist on type { price: string }
            params.row.tax;
            params.row.price.toUpperCase();
            return [];
          },
        },
        {
          field: 'price7',
          type: 'actions',
          getActions: (params: GridRowParams) => {
            // row is typed as any by default
            params.row.price.toUpperCase();
            return [];
          },
        },
      ]}
    />
  );
}

function CellParamsFromRowModel() {
  type PriceRowModel = { price1: number; price2: string };

  const actionColumn: GridColDef<PriceRowModel> = {
    field: 'price1',
    type: 'actions',
    getActions: (params) => {
      // @ts-expect-error `toUpperCase` does not exist on number
      return params.row.price1.toUpperCase(); // fails
    },
  };

  const priceCol: GridColDef<PriceRowModel> = {
    field: 'price2',
    renderCell: (params) => {
      // @ts-expect-error `toExponential` does not exist on string
      return params.row.price2.toExponential();
    },
  };

  const columns: GridColDef<PriceRowModel>[] = [
    {
      field: 'price1',
      type: 'actions',
      getActions: (params) => {
        // @ts-expect-error `toUpperCase` does not exist on number
        return params.row.price1.toUpperCase(); // fails
      },
    },
    {
      field: 'price2',
      renderCell: (params) => {
        // @ts-expect-error `toExponential` does not exist on string
        return params.row.price2.toExponential();
      },
    },
  ];

  return <DataGrid rows={[]} columns={columns} />;
}

function CellParamsValue() {
  return (
    <DataGrid
      rows={[]}
      columns={[{ field: 'brand' }]}
      onCellClick={(params: GridCellParams<any, any>) => {
        params.value!.toUpperCase();
      }}
      onCellDoubleClick={(params: GridCellParams<any, any>) => {
        params.value!.toUpperCase();
      }}
    />
  );
}

function CellParamsRow() {
  return (
    <DataGrid
      rows={[]}
      columns={[{ field: 'brand' }]}
      onCellClick={(params: GridCellParams) => {
        params.row.brand!.toUpperCase();
      }}
      onCellDoubleClick={(params: GridCellParams<{ brand: number }, any>) => {
        // @ts-expect-error `toUpperCase` doesn't exist in number
        params.row.brand!.toUpperCase();
      }}
    />
  );
}

function CellParamsFormattedValue() {
  return (
    <DataGrid
      rows={[]}
      columns={[{ field: 'brand' }]}
      onCellClick={(params: GridCellParams<any, any>) => {
        params.formattedValue!.toUpperCase();
      }}
      onCellDoubleClick={(params: GridCellParams<any, any>) => {
        params.formattedValue!.toUpperCase();
      }}
    />
  );
}

const constBrandColumns = [{ field: 'brand' }] as const;
const constEmptyRows = [] as const;

function ConstProps() {
  return <DataGrid rows={constEmptyRows} columns={constBrandColumns} />;
}

function ValueGetter() {
  const oldSignatureValueGetter: GridColDef[] = [
    {
      field: 'brand',
      valueGetter: (params) => {
        type Test = Expect<Equal<typeof params, never>>;
        return '';
      },
    },
    {
      field: 'brand',
      valueGetter: ({ value, row }) => {
        type Tests = [Expect<Equal<typeof value, never>>, Expect<Equal<typeof row, never>>];
        return '';
      },
    },
  ];

  const currentSignatureValueGetter: GridColDef[] = [
    {
      field: 'brand',
      valueGetter: (value) => {
        type Test = Expect<Equal<typeof value, never>>;
        return value;
      },
    },
    {
      field: 'brand',
      valueGetter: (value: number) => {
        type Test = Expect<Equal<typeof value, number>>;
        return value;
      },
    },
    {
      field: 'brand',
      valueGetter: (value: 'foo' | 'bar') => {
        type Test = Expect<Equal<typeof value, 'foo' | 'bar'>>;
        return value;
      },
    },
  ];
}

function ValueFormatter() {
  const oldSignatureValueFormatter: GridColDef[] = [
    {
      field: 'brand',
      valueFormatter: (params) => {
        type Test = Expect<Equal<typeof params, never>>;
        return '';
      },
    },
    {
      field: 'brand',
      valueFormatter: ({ value, row }) => {
        type Tests = [Expect<Equal<typeof value, never>>, Expect<Equal<typeof row, never>>];
        return '';
      },
    },
  ];

  const currentSignatureValueFormatter: GridColDef[] = [
    {
      field: 'brand',
      valueFormatter: (value) => {
        type Test = Expect<Equal<typeof value, never>>;
        return value;
      },
    },
    {
      field: 'brand',
      valueFormatter: (value: number) => {
        type Test = Expect<Equal<typeof value, number>>;
        return value;
      },
    },
    {
      field: 'brand',
      valueFormatter: (value: 'foo' | 'bar') => {
        type Test = Expect<Equal<typeof value, 'foo' | 'bar'>>;
        return value;
      },
    },
  ];
}

function GroupingValueGetter() {
  const oldSignatureGroupingValueGetter: GridColDef[] = [
    {
      field: 'brand',
      groupingValueGetter: (params) => {
        type Test = Expect<Equal<typeof params, never>>;
        return '';
      },
    },
    {
      field: 'brand',
      groupingValueGetter: ({ value, row }) => {
        type Tests = [Expect<Equal<typeof value, never>>, Expect<Equal<typeof row, never>>];
        return '';
      },
    },
  ];

  const currentSignatureGroupingValueGetter: GridColDef[] = [
    {
      field: 'brand',
      groupingValueGetter: (value) => {
        type Test = Expect<Equal<typeof value, never>>;
        return value;
      },
    },
    {
      field: 'brand',
      groupingValueGetter: (value: number) => {
        type Test = Expect<Equal<typeof value, number>>;
        return value;
      },
    },
    {
      field: 'brand',
      groupingValueGetter: (value: 'foo' | 'bar') => {
        type Test = Expect<Equal<typeof value, 'foo' | 'bar'>>;
        return value;
      },
    },
  ];
}
