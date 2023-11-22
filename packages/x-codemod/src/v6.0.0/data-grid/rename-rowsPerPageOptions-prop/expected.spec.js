import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { DataGridPremium } from '@mui/x-data-grid-premium'

function App () {
  return <>
    <DataGrid pageSizeOptions={[5, 10, 15]} />
    <DataGridPro pageSizeOptions={[5, 10, 15]} />
    <DataGridPremium pageSizeOptions={[5, 10, 15]} />
  </>;
}

export default App
