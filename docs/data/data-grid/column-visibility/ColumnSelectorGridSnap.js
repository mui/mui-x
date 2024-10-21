import * as React from 'react';
import {
  DataGrid,
  useGridApiRef,
  GridPreferencePanelsValue,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

// This demo is used in visual regression tests to spot regressions in the columns panel
export default function ColumnSelectorGridSnap() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  const apiRef = useGridApiRef();

  React.useEffect(() => {
    apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
  }, [apiRef]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        apiRef={apiRef}
        {...data}
        slotProps={{ columnsManagement: { autoFocusSearchField: false } }}
      />
    </div>
  );
}
