import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function RowsGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        rowIdAccessor='test'
        columns={[{ field: 'name' }, {field: 'test'}]}
        rows={[
          { id: 1, name: 'React', test: 7 },
          { id: 2, name: 'Material-UI', test: 8 },
        ]}
      />
    </div>
  );
}
