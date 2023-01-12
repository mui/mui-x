import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'

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
    </React.Fragment>
  );
}

export default App
