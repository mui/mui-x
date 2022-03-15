import * as React from 'react';
import { DataGrid, useGridApiRef, GridCellParams, GridRowParams } from '@mui/x-data-grid';

function PropTest() {
  const apiRef = useGridApiRef();
  return (
    <div>
      <DataGrid rows={[]} columns={[]} />
      <DataGrid rows={[]} columns={[]} pagination />
      {/* @ts-expect-error Type 'false' is not assignable to type 'true | undefined' */}
      <DataGrid pagination={false} />
      {/* @ts-expect-error Type 'GridApiRef' is not assignable to type 'undefined' */}
      <DataGrid apiRef={apiRef} />
      <DataGrid
        rows={[]}
        columns={[]}
        localeText={{
          MuiTablePagination: {
            labelRowsPerPage: 'ofo',
          },
        }}
      />
      <DataGrid
        rows={[]}
        columns={[]}
        localeText={{
          MuiTablePagination: {
            /* @ts-expect-error Object literal may only specify known properties, but 'labelRowsPerPagee' does not exist in type */
            labelRowsPerPagee: 'foo',
          },
        }}
      />
    </div>
  );
}

function SxTest() {
  <DataGrid rows={[]} columns={[]} sx={{ color: 'primary.main' }} />;
}

function CellEditingProps() {
  <DataGrid
    rows={[]}
    columns={[]}
    onCellEditStart={(params: GridCellParams) => {}}
    onCellEditStop={(params: GridCellParams) => {}}
  />;
}

function RowEditingProps() {
  <DataGrid
    rows={[]}
    columns={[]}
    onRowEditStart={(params: GridRowParams) => {}}
    onRowEditStop={(params: GridRowParams) => {}}
  />;
}

function RowPropTest() {
  return (
    <div>
      {/* @ts-expect-error */}
      <DataGrid<{ firstName: string }> rows={[{ firstName: 2 }]} columns={[]} />;
      {/* @ts-expect-error */}
      <DataGrid<{ firstName: string }> rows={[{}]} columns={[]} />;
      <DataGrid<{ firstName: string }> rows={[{ firstName: 'John' }]} columns={[]} />;
      <DataGrid rows={[{ firstName: 'John' }]} columns={[]} />;
    </div>
  );
}

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGrid<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (params) => params.row.lastName,
            // @ts-expect-error
            valueParser: (value, params) => params!.row.lastName,
            valueSetter: (params) => {
              // @ts-expect-error
              const lastName = params.row.lastName;
              return {} as any;
            },
            // @ts-expect-error
            renderCell: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGrid<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (params) => params.row.firstName,
            valueParser: (value, params) => params!.row.firstName,
            valueSetter: (params) => {
              const firstName = params.row.firstName;
              return {} as any;
            },
            renderCell: (params) => params.row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGrid
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (params) => params.row.lastName,
            // @ts-expect-error
            valueParser: (value, params) => params!.row.lastName,
            valueSetter: (params) => {
              // @ts-expect-error
              const lastName = params.row.lastName;
              return {} as any;
            },
            // @ts-expect-error
            renderCell: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGrid
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (params) => params.row.firstName,
            valueParser: (value, params) => params!.row.firstName,
            valueSetter: (params) => {
              const firstName = params.row.firstName;
              return {} as any;
            },
            renderCell: (params) => params.row.firstName,
          },
        ]}
      />
    </div>
  );
}
