import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

function EnterpriseTest() {
  return (
    <div>
      <DataGrid rows={[]} columns={[]} />
      <DataGrid rows={[]} columns={[]} pagination />
      {/* @ts-expect-error Type 'false' is not assignable to type 'true | undefined' */}
      <DataGrid pagination={false} />
    </div>
  );
}
