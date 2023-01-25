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
        columnHeaderHeight
      />
      <DataGridPro
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
        columnHeaderHeight
      />
      <DataGridPremium
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
        columnHeaderHeight
      />
    </React.Fragment>
  );
}

export default App
