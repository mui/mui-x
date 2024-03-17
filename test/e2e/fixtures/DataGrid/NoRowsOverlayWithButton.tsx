import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [{ field: 'brand', width: 100 }];

function NoRowsOverlay() {
  const [text, setText] = React.useState('Refresh');

  return (
    <button type="button" data-testid="refresh" onClick={() => setText('Clicked')}>
      {text}
    </button>
  );
}

export default function NoRowsOverlayWithButton() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <DataGrid columns={columns} rows={[]} slots={{ noRowsOverlay: NoRowsOverlay }} />
    </div>
  );
}
