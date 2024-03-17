import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { DataGridPro } from '@mui/x-data-grid-pro'
import { DataGridPremium } from '@mui/x-data-grid-premium'

function App () {
  return (
    <DataGridPremium
      unstable_cellSelection
      unstable_cellSelectionModel={{ 0: { id: true, currencyPair: true, price1M: false } }} 
      unstable_onCellSelectionModelChange={() => {}}
    />
  )
}

export default App
