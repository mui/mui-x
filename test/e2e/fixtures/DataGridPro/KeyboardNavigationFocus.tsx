import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';

const baselineProps = {
  rows: Array.from({ length: 100 }).map((a, index) => ({ id: index, name: index })),
  columns: [{ field: 'id' }, { field: 'name' }],
};

export default function KeyboardNavigationFocus() {
  return (
    <React.Fragment>
      <button type="button" autoFocus data-testid="initial-focus">
        initial focus
      </button>
      <div style={{ width: 300, height: 200 }}>
        <DataGridPro {...baselineProps} rowBufferPx={52} />
      </div>
    </React.Fragment>
  );
}
