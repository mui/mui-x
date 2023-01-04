import * as React from 'react';
import { GridColumnMenuSortItem } from '@mui/x-data-grid';

function App({ column, hideMenu }) {
  return (
    <React.Fragment>
      <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
    </React.Fragment>
  );
}

export default App;
