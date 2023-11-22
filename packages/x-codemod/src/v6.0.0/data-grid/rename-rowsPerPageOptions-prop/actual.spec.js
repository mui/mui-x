import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { DataGridPremium } from '@mui/x-data-grid-premium'

function App () {
  return <>
    <DataGrid rowsPerPageOptions={[5, 10, 15]} />
    <DataGridPro rowsPerPageOptions={[5, 10, 15]} />
    <DataGridPremium rowsPerPageOptions={[5, 10, 15]} />
  </>;
}

export default App
