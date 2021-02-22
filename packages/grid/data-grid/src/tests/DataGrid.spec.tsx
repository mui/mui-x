import * as React from 'react';
import { DataGrid, useGridApiRef } from '@material-ui/data-grid';

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
    </div>
  );
}
