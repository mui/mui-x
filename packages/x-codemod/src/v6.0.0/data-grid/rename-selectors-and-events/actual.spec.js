import * as React from 'react'
import { DataGrid, useGridApiEventHandler, gridSelectionStateSelector } from '@mui/x-data-grid'

const useGridSelector = (apiRef, selector) => {};
const apiRef = {};

function App () {
  useGridApiEventHandler('selectionChange', handleEvent);
  apiRef.current.subscribeEvent('selectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);
  return <DataGrid />;
}

export default App
