import * as React from 'react';
import { DataGrid, useApiRef } from '@material-ui/data-grid';

function EnterpriseTest() {
  const apiRef = useApiRef();
  return (
    <div>
      <DataGrid rows={[]} columns={[]} />
      <DataGrid rows={[]} columns={[]} pagination />
      {/* @ts-expect-error Type 'false' is not assignable to type 'true | undefined' */}
      <DataGrid pagination={false} />
      {/* @ts-expect-error Type 'ApiRef' is not assignable to type 'undefined' */}
      <DataGrid apiRef={apiRef} />
    </div>
  );
}
