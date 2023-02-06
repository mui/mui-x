import * as React from 'react'
import {
  DataGrid,
  useGridApiEventHandler,
  gridSelectionStateSelector,
  gridVisibleSortedRowIdsSelector,
  gridVisibleSortedRowEntriesSelector,
  gridVisibleRowCountSelector,
  gridVisibleSortedTopLevelRowEntriesSelector,
  gridVisibleTopLevelRowCountSelector,
} from '@mui/x-data-grid';

const useGridSelector = (apiRef, selector) => {};
const apiRef = {};

function App () {
  useGridApiEventHandler('selectionChange', handleEvent);
  apiRef.current.subscribeEvent('selectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);
  const sortedRowIds = useGridSelector(apiRef, gridVisibleSortedRowIdsSelector);
  const sortedRowEntries = useGridSelector(apiRef, gridVisibleSortedRowEntriesSelector);
  const rowCount = useGridSelector(apiRef, gridVisibleRowCountSelector);
  const sortedTopLevelRowEntries = useGridSelector(apiRef, gridVisibleSortedTopLevelRowEntriesSelector);
  const topLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);
  return <DataGrid />;
}

export default App
