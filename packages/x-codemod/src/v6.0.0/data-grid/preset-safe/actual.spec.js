import * as React from 'react';
import { DataGrid, SortGridMenuItems, useGridSelector, gridSelectionStateSelector } from '@mui/x-data-grid';

function App({ column, hideMenu, apiRef, handleEvent }) {
  const localeText = apiRef.current.getLocaleText('filterPanelLinkOperator');
  apiRef.current.subscribeEvent('selectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);
  return (
    <React.Fragment>
      <DataGrid
        disableMultipleSelection
        showCellRightBorder
        disableExtendRowFullWidth
        rowsPerPageOptions={[5]}
      />
      <SortGridMenuItems column={column} onClick={hideMenu} />
    </React.Fragment>
  );
}

export default App;
