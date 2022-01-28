import * as React from 'react';
import { DataGrid, GridRowIdGetter } from '@mui/x-data-grid';

export default function RowsGridWithGetRowId() {
  const getRowId = React.useCallback<GridRowIdGetter>((row) => row.internalId, []);
  return (
    <div style={{ height: 250, width: '100%' }}>
      <DataGrid
        columns={[{ field: 'name' }]}
        rows={[
          { internalId: 1, name: 'React' },
          { internalId: 2, name: 'MUI' },
        ]}
        getRowId={getRowId}
      />
    </div>
  );
}
