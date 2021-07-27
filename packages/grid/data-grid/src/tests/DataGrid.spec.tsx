import * as React from 'react';
import { DataGrid, useGridApiRef } from '@material-ui/data-grid';

function EnterpriseTest() {
  const apiRef = useGridApiRef();
  return (
    <div>
      <DataGrid rows={[]} columns={[]} />
      {/* @ts-expect-error Object literal may only specify known properties, but 'pagination' does not exist in type  */}
      <DataGrid rows={[]} columns={[]} pagination />
      {/* @ts-expect-error Object literal may only specify known properties, but 'pagination' does not exist in type  */}
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
