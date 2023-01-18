import * as React from 'react';
import { DataGrid, GridColumnMenuSortItem } from '@mui/x-data-grid';

function App({ column, hideMenu }) {
  return (
    <React.Fragment>
      <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
      <DataGrid pageSizeOptions={[5]} />
    </React.Fragment>
  );
}

export default App;
