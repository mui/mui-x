import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';

export default function RowsGrid() {
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        // rowIdAccessor='customUniKey'
        columns={[{ field: 'name' }, {field: 'customUniKey'}]}
        rows={[
          {  name: 'React', customUniKey: 'uniNo-1' },
          {  name: 'Material-UI', customUniKey: 'uniNo-2' },
        ]}
      />
    </div>
  );
}
