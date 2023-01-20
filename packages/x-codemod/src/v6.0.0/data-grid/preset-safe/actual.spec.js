import * as React from 'react';
import { DataGrid, SortGridMenuItems } from '@mui/x-data-grid';

function App({ column, hideMenu }) {
  return (
    <React.Fragment>
      <SortGridMenuItems column={column} onClick={hideMenu} />
      <DataGrid disableExtendRowFullWidth rowsPerPageOptions={[5]} />
    </React.Fragment>
  );
}

export default App;
