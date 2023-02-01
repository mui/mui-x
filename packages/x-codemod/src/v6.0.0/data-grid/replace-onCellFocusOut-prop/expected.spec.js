import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro, GridEventListener } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

function App() {
  const handleCellFocusOut: GridEventListener<'cellFocusOut'> = (params, event) => {
    event.defaultMuiPrevented = true;
  };
  return (
    <React.Fragment>
      <DataGrid
        componentsProps={{
          cell: {
            onBlur: (event) => {
              const cellElement = event.currentTarget;
              const field = cellElement.getAttribute('data-field');
              const rowId = cell.parentElement.getAttribute('data-id');
            },
          },
        }}
      />
      <DataGridPro 
        componentsProps={{
          cell: {
            onBlur: handleCellFocusOut,
          },
        }} />
      <DataGridPro 
        componentsProps={{
          cell: {
            onBlur: handleCellFocusOut,
          },
        }} />
    </React.Fragment>
  );
}

export default App;