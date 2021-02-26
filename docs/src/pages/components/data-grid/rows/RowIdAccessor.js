import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function RowIdAccessorDemo() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        rowIdAccessor="customUniKey"
        columns={[
          { field: 'customUniKey', width: 150 },
          { field: 'name', width: 200 },
        ]}
        rows={[
          { customUniKey: 'uniNo-1', name: 'React' },
          { customUniKey: 'uniNo-2', name: 'Material-UI' },
        ]}
      />
    </div>
  );
}
