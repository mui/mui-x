import * as React from 'react';
import { DataGrid, GridColumnMenuSortItem } from '@mui/x-data-grid';

function App({ column, hideMenu, apiRef }) {
  const localeText = apiRef.current.getLocaleText('filterPanelLogicOperator');
  return (
    <React.Fragment>
      <DataGrid disableMultipleRowSelection showCellVerticalBorder pageSizeOptions={[5]} />
      <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
    </React.Fragment>
  );
}

export default App;
