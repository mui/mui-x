import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { DataGridPremium } from '@mui/x-data-grid-premium'

function App () {
  return (
    (<React.Fragment>
      <DataGrid
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
        columnHeaderHeight={56}
      />
      <DataGridPro
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
        columnHeaderHeight={56}
      />
      <DataGridPremium
        rowSelectionModel={[]}
        onRowSelectionModelChange={() => {}}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        showCellVerticalBorder
        showColumnVerticalBorder
        columnHeaderHeight={56}
      />
    </React.Fragment>)
  );
}

export default App
