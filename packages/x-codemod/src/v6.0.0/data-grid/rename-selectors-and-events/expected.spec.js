import * as React from 'react'
import {
  DataGrid,
  useGridApiEventHandler,
  gridRowSelectionStateSelector,
  gridExpandedSortedRowIdsSelector,
  gridExpandedSortedRowEntriesSelector,
  gridExpandedRowCountSelector,
  gridFilteredSortedTopLevelRowEntriesSelector,
  gridFilteredTopLevelRowCountSelector,
} from '@mui/x-data-grid';

const useGridSelector = (apiRef, selector) => {};
const apiRef = {};

function App () {
  useGridApiEventHandler('rowSelectionChange', handleEvent);
  apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
  const sortedRowIds = useGridSelector(apiRef, gridExpandedSortedRowIdsSelector);
  const sortedRowEntries = useGridSelector(apiRef, gridExpandedSortedRowEntriesSelector);
  const rowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const sortedTopLevelRowEntries = useGridSelector(apiRef, gridFilteredSortedTopLevelRowEntriesSelector);
  const topLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  return <DataGrid />;
}

export default App
