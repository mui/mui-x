import * as React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';

const rows = [{ id: 1, username: '@MUI', age: 20 }];

// Mirrors the fluid width example from /x/react-data-grid/column-dimensions#fluid-width
const columns = [
  { field: 'id', flex: 1, minWidth: 150 },
  { field: 'username', width: 200 },
  { field: 'age', flex: 0.3, minWidth: 50 },
];

export default function ColumnFluidWidthScrollClamp() {
  const apiRef = useGridApiRef();

  const scrollToMax = React.useCallback(() => {
    const { rowWidth, viewportOuterSize } = apiRef.current.state.dimensions;
    apiRef.current.scroll({ left: Math.max(0, rowWidth - viewportOuterSize.width) });
  }, [apiRef]);

  const shrinkUsername = React.useCallback(() => {
    apiRef.current.setColumnWidth('username', 100);
  }, [apiRef]);

  return (
    <div style={{ width: 302 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={scrollToMax}>
          Scroll to max
        </button>
        <button type="button" onClick={shrinkUsername}>
          Shrink username
        </button>
      </div>
      <div style={{ height: 250 }}>
        <DataGrid apiRef={apiRef} rows={rows} columns={columns} hideFooter />
      </div>
    </div>
  );
}
