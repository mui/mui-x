import * as React from 'react';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';

function ColumnPropTest() {
  return (
    <div>
      {/* Wrong column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            groupingValueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column with explicit generic on DataGrid */}
      <DataGridPremium<{ firstName: string }>
        rows={[]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (params) => params.row.firstName,
          },
        ]}
      />
      {/* Wrong column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            // @ts-expect-error
            groupingValueGetter: (params) => params.row.lastName,
          },
        ]}
      />
      {/* Valid column without explicit generic on DataGrid */}
      <DataGridPremium
        rows={[{ firstName: 'John' }]}
        columns={[
          {
            field: 'firstName',
            groupingValueGetter: (params) => params.row.firstName,
          },
        ]}
      />
    </div>
  );
}

function ApiRefPrivateMethods() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    // @ts-expect-error Property 'updateControlState' does not exist on type 'GridApiPremium'
    apiRef.current.updateControlState();
    // @ts-expect-error Property 'registerControlState' does not exist on type 'GridApiPremium'
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
    apiRef.current.setColumnIndex;
    apiRef.current.setRowIndex;
    apiRef.current.setRowChildrenExpansion;
    apiRef.current.getRowGroupChildren;
  });

  return null;
}
