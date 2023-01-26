import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { DataGridPremium } from '@mui/x-data-grid-premium'

function App () {
  return (
    <React.Fragment>
      <DataGrid
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
      />
      <DataGridPro
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
      />
      <DataGridPremium
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
      />
    </React.Fragment>
  );
}

export default App
