import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

export default function AutoHeightDetailPanel() {
  return (
    <div style={{ width: 800, height: 450 }}>
      <DataGridPro
        rows={[{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]}
        columns={[{ field: 'id' }]}
        scrollbarSize={15}
        initialState={{ detailPanel: { expandedRowIds: new Set([0]) } }}
        getDetailPanelHeight={() => 'auto'}
        getDetailPanelContent={() => (
          <details>
            <summary>Panel content</summary>
            <div style={{ height: 400 }}>Expanded content</div>
          </details>
        )}
      />
    </div>
  );
}
