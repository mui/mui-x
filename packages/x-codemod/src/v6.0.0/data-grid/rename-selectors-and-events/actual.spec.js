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
  allGridColumnsFieldsSelector,
  allGridColumnsSelector,
  visibleGridColumnsSelector,
  filterableGridColumnsSelector,
  getGridNumericColumnOperators,
} from '@mui/x-data-grid';

const useGridSelector = (apiRef, selector) => {};
const apiRef = {};

function App () {
  useGridApiEventHandler(apiRef, 'selectionChange', handleEvent);
  apiRef.current.subscribeEvent('selectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridSelectionStateSelector);
  const sortedRowIds = useGridSelector(apiRef, gridVisibleSortedRowIdsSelector);
  const sortedRowEntries = useGridSelector(apiRef, gridVisibleSortedRowEntriesSelector);
  const rowCount = useGridSelector(apiRef, gridVisibleRowCountSelector);
  const sortedTopLevelRowEntries = useGridSelector(apiRef, gridVisibleSortedTopLevelRowEntriesSelector);
  const topLevelRowCount = useGridSelector(apiRef, gridVisibleTopLevelRowCountSelector);
  const allGridColumnsFields = useGridSelector(apiRef, allGridColumnsFieldsSelector);
  const allGridColumns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleGridColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const filterableGridColumns = useGridSelector(apiRef, filterableGridColumnsSelector);
  const getGridNumericColumn = useGridSelector(apiRef, getGridNumericColumnOperators);
  return <DataGrid />;
}

export default App
