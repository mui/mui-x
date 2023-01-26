import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { DataGridPremium } from '@mui/x-data-grid-premium'

function App () {
  return (
    <React.Fragment>
      <DataGrid
        selectionModel={[]}
        onSelectionModelChange={() => {}}
        disableSelectionOnClick
        disableMultipleSelection
        showCellRightBorder
        showColumnRightBorder
      />
      <DataGridPro
        selectionModel={[]}
        onSelectionModelChange={() => {}}
        disableSelectionOnClick
        disableMultipleSelection
        showCellRightBorder
        showColumnRightBorder
      />
      <DataGridPremium
        selectionModel={[]}
        onSelectionModelChange={() => {}}
        disableSelectionOnClick
        disableMultipleSelection
        showCellRightBorder
        showColumnRightBorder
      />
    </React.Fragment>
  );
}

export default App
