import * as React from 'react';
import { DataGrid, SortGridMenuItems } from '@mui/x-data-grid';

function App({ column, hideMenu, apiRef }) {
  const localeText = apiRef.current.getLocaleText('filterPanelLinkOperator');
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
