import * as React from 'react'
import { DataGrid, useGridApiEventHandler, gridRowSelectionStateSelector } from '@mui/x-data-grid'

const useGridSelector = (apiRef, selector) => {};
const apiRef = {};

function App () {
  useGridApiEventHandler('rowSelectionChange', handleEvent);
  apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
  return <DataGrid/>;
}

export default App
