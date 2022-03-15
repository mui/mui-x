import * as React from 'react';
import { DataGrid, useGridApiRef, GridCellParams, GridRowParams } from '@mui/x-data-grid';

function EnterpriseTest() {
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
