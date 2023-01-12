import * as React from 'react';
import { DataGrid, GridColumnMenuSortItem } from '@mui/x-data-grid';

function App({ column, hideMenu }) {
  return (
    <React.Fragment>
      <DataGrid
        disableMultipleRowSelection
        showCellVerticalBorder
      />
      <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
    </React.Fragment>
  );
}

export default App;
