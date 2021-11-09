import * as React from 'react';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { GridCellParams } from '../../../_modules_/grid/models/params/gridCellParams';

const TestRenderCellParams = () => {
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
          renderCell: (params: GridRenderCellParams<number>) => {
            // @ts-expect-error `toUpperCase` doesn't exist in number
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
            // @ts-expect-error `toUpperCase` doesn't exist in number
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
      ]}
    />
  );
};

const TestCellParamsValue = () => {
  return (
    <DataGrid
      rows={[]}
      columns={[{ field: 'brand' }]}
      onCellClick={(params: GridCellParams) => {
        params.value!.toUpperCase();
      }}
      onCellDoubleClick={(params: GridCellParams<number>) => {
        // @ts-expect-error `toUpperCase` doesn't exist in number
        params.value!.toUpperCase();
      }}
    />
  );
};

const TestCellParamsRow = () => {
  return (
    <DataGrid
      rows={[]}
      columns={[{ field: 'brand' }]}
      onCellClick={(params: GridCellParams<any>) => {
        params.row.brand!.toUpperCase();
      }}
      onCellDoubleClick={(params: GridCellParams<any, { brand: number }>) => {
        // @ts-expect-error `toUpperCase` doesn't exist in number
        params.row.brand!.toUpperCase();
      }}
    />
  );
};

const TestCellParamsFormattedValue = () => {
  return (
    <DataGrid
      rows={[]}
      columns={[{ field: 'brand' }]}
      onCellClick={(params: GridCellParams<any>) => {
        params.formattedValue!.toUpperCase();
      }}
      onCellDoubleClick={(params: GridCellParams<any, any, number>) => {
        // @ts-expect-error `toUpperCase` doesn't exist in number
        params.formattedValue!.toUpperCase();
      }}
    />
  );
};
