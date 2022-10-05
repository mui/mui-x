import * as React from 'react';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';

function SxTest() {
  <DataGridPro rows={[]} columns={[]} sx={{ color: 'primary.main' }} />;
}

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGridPro<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGridPro<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (params) => params.row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGridPro
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            valueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGridPro
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            valueGetter: (params) => params.row.firstName,
          },
        ]}
      />
    </div>
  );
}

function ApiRefPrivateMethods() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    // @ts-expect-error Property 'updateControlState' does not exist on type 'GridApiPro'
    apiRef.current.updateControlState();
    // @ts-expect-error Property 'registerControlState' does not exist on type 'GridApiPro'
    apiRef.current.registerControlState();
  });

  return null;
}

function ApiRefProMethods() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    // available in Pro and Premium
    apiRef.current.selectRows([]);
    apiRef.current.selectRowRange({ startId: 0, endId: 1 });
  });

  return null;
}
