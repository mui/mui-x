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
        headerHeight={56}
      />
      <DataGridPro
        selectionModel={[]}
        onSelectionModelChange={() => {}}
        disableSelectionOnClick
        disableMultipleSelection
        showCellRightBorder
        showColumnRightBorder
        headerHeight={56}
      />
      <DataGridPremium
        selectionModel={[]}
        onSelectionModelChange={() => {}}
        disableSelectionOnClick
        disableMultipleSelection
        showCellRightBorder
        showColumnRightBorder
        headerHeight={56}
      />
    </React.Fragment>
  );
}

export default App
