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
  gridColumnFieldsSelector,
  gridColumnDefinitionsSelector,
  gridVisibleColumnDefinitionsSelector,
  gridFilterableColumnDefinitionsSelector,
  getGridNumericOperators,
} from '@mui/x-data-grid';

const useGridSelector = (apiRef, selector) => {};
const apiRef = {};

function App () {
  useGridApiEventHandler(apiRef, 'rowSelectionChange', handleEvent);
  apiRef.current.subscribeEvent('rowSelectionChange', handleEvent);
  const selection = useGridSelector(apiRef, gridRowSelectionStateSelector);
  const sortedRowIds = useGridSelector(apiRef, gridExpandedSortedRowIdsSelector);
  const sortedRowEntries = useGridSelector(apiRef, gridExpandedSortedRowEntriesSelector);
  const rowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const sortedTopLevelRowEntries = useGridSelector(apiRef, gridFilteredSortedTopLevelRowEntriesSelector);
  const topLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  const allGridColumnsFields = useGridSelector(apiRef, gridColumnFieldsSelector);
  const allGridColumns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const visibleGridColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const filterableGridColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
  const getGridNumericColumn = useGridSelector(apiRef, getGridNumericOperators);
  return <DataGrid />;
}

export default App
