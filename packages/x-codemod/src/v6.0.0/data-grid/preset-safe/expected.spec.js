import * as React from 'react';
import { DataGrid, GridColumnMenuSortItem, useGridSelector, gridRowSelectionStateSelector } from '@mui/x-data-grid';

function App({ column, hideMenu, apiRef, handleEvent }) {
  const localeText = apiRef.current.getLocaleText('filterPanelLogicOperator');
  apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
  return (
    <React.Fragment>
      <DataGrid
        disableMultipleRowSelection
        showCellVerticalBorder
        pageSizeOptions={[5]}
        filterModel={{
          items: [
            {
              field: 'column',
              operator: 'contains',
              value: 'a',
            },
          ],
        }} />
      <GridColumnMenuSortItem colDef={column} onClick={hideMenu} />
    </React.Fragment>
  );
}

export default App;
