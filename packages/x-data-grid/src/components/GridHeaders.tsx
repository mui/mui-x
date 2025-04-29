import * as React from 'react';
import { fastMemo } from '@mui/x-internals/fastMemo';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  gridColumnVisibilityModelSelector,
  gridVisibleColumnDefinitionsSelector,
} from '../hooks/features/columns/gridColumnsSelector';
import { gridFilterActiveItemsLookupSelector } from '../hooks/features/filter/gridFilterSelector';
import { gridSortColumnLookupSelector } from '../hooks/features/sorting/gridSortingSelector';
import {
  gridTabIndexColumnHeaderSelector,
  gridTabIndexCellSelector,
  gridFocusColumnHeaderSelector,
  gridTabIndexColumnGroupHeaderSelector,
  gridFocusColumnGroupHeaderSelector,
} from '../hooks/features/focus/gridFocusStateSelector';
import {
  gridColumnGroupsHeaderMaxDepthSelector,
  gridColumnGroupsHeaderStructureSelector,
} from '../hooks/features/columnGrouping/gridColumnGroupsSelector';
import { gridColumnMenuSelector } from '../hooks/features/columnMenu/columnMenuSelector';

function GridHeaders() {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();

  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const filterColumnLookup = useGridSelector(apiRef, gridFilterActiveItemsLookupSelector);
  const sortColumnLookup = useGridSelector(apiRef, gridSortColumnLookupSelector);
  const columnHeaderTabIndexState = useGridSelector(apiRef, gridTabIndexColumnHeaderSelector);
  const hasNoCellTabIndexState = useGridSelector(
    apiRef,
    () => gridTabIndexCellSelector(apiRef) === null,
  );

  const columnGroupHeaderTabIndexState = useGridSelector(
    apiRef,
    gridTabIndexColumnGroupHeaderSelector,
  );

  const columnHeaderFocus = useGridSelector(apiRef, gridFocusColumnHeaderSelector);
  const columnGroupHeaderFocus = useGridSelector(apiRef, gridFocusColumnGroupHeaderSelector);

  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);

  const columnMenuState = useGridSelector(apiRef, gridColumnMenuSelector);
  const columnVisibility = useGridSelector(apiRef, gridColumnVisibilityModelSelector);
  const columnGroupsHeaderStructure = useGridSelector(
    apiRef,
    gridColumnGroupsHeaderStructureSelector,
  );

  const hasOtherElementInTabSequence = !(
    columnGroupHeaderTabIndexState === null &&
    columnHeaderTabIndexState === null &&
    hasNoCellTabIndexState
  );

  const columnsContainerRef = apiRef.current.columnHeadersContainerRef;

  return (
    <rootProps.slots.columnHeaders
      ref={columnsContainerRef}
      visibleColumns={visibleColumns}
      filterColumnLookup={filterColumnLookup}
      sortColumnLookup={sortColumnLookup}
      columnHeaderTabIndexState={columnHeaderTabIndexState}
      columnGroupHeaderTabIndexState={columnGroupHeaderTabIndexState}
      columnHeaderFocus={columnHeaderFocus}
      columnGroupHeaderFocus={columnGroupHeaderFocus}
      headerGroupingMaxDepth={headerGroupingMaxDepth}
      columnMenuState={columnMenuState}
      columnVisibility={columnVisibility}
      columnGroupsHeaderStructure={columnGroupsHeaderStructure}
      hasOtherElementInTabSequence={hasOtherElementInTabSequence}
      {...rootProps.slotProps?.columnHeaders}
    />
  );
}

const MemoizedGridHeaders = fastMemo(GridHeaders);

export { MemoizedGridHeaders as GridHeaders };
