import * as React from 'react';
import { DataGrid, SortGridMenuItems } from '@mui/x-data-grid';

function App({ column, hideMenu }) {
  return (
    <React.Fragment>
      <DataGrid
        disableMultipleSelection
        showCellRightBorder
        disableExtendRowFullWidth
      />
      <SortGridMenuItems column={column} onClick={hideMenu} />
    </React.Fragment>
  );
}

export default App;
