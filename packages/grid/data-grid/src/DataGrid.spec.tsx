import * as React from 'react';
import {ColDef, DataGrid} from '@material-ui/data-grid';

function EnterpriseTest() {
  const cols: ColDef[] = [{
    // /* @ts-expect-error Object literal may only specify known properties, and 'resizable' does not exist in type 'ColDef'. */
    field: 'name', resizable: true },
    { field: 'id', resizable: false},
    { field: 'age' }
  ];

  return (
    <div>
      <DataGrid rows={[]} columns={[]} />
      <DataGrid rows={[]} columns={[]} pagination />
      {/* @ts-expect-error Type 'false' is not assignable to type 'true | undefined' */}
      <DataGrid pagination={false} />
      <DataGrid rows={[]} columns={cols} />
    </div>
  );
}
