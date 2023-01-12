import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'

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
    </React.Fragment>
  );
}

export default App
