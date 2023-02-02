import * as React from 'react';
import { DataGrid, SortGridMenuItems, useGridSelector, gridSelectionStateSelector } from '@mui/x-data-grid';

function App({ column, hideMenu, apiRef, handleEvent }) {
  apiRef.current.subscribeEvent('selectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);
  const handleCellFocusOut = (params, event) => {
    event.defaultMuiPrevented = true;
  };
  return (
    <React.Fragment>
      <DataGrid
        disableMultipleSelection
        showCellRightBorder
        disableExtendRowFullWidth
        rowsPerPageOptions={[5]}
        onCellFocusOut={handleCellFocusOut}
      />
      <SortGridMenuItems column={column} onClick={hideMenu} />
    </React.Fragment>
  );
}

export default App;
