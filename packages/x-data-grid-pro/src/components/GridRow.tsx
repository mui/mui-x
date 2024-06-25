import * as React from 'react';
import {
  GridRow as DataGridRow,
  GridRowProps,
  gridExpandedSortedRowIdsLookupSelector,
  gridFilteredDescendantCountLookupSelector,
} from '@mui/x-data-grid';
import { useGridPrivateApiContext, useGridSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';

export function GridRow(props: GridRowProps) {
  const { rowId } = props;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const rowNode = apiRef.current.getRowNode(rowId);

  if (rootProps.treeData !== true || rowNode === null || rowNode.parent === null) {
    return <DataGridRow {...props} />;
  }

  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;

  const sortedVisibleRowIdsLookup = useGridSelector(apiRef, gridExpandedSortedRowIdsLookupSelector);
  const currentLevelIds = sortedVisibleRowIdsLookup[rowNode.parent];

  const ariaAttributes = React.useMemo(
    () => ({
      'aria-level': rowNode.depth + 1,
      'aria-setsize': currentLevelIds.length,
      'aria-posinset': currentLevelIds.indexOf(rowNode.id) + 1,
      // aria-expanded should only be added to the rows that contain children
      ...(rowNode.type === 'group' && filteredDescendantCount > 0
        ? { 'aria-expanded': Boolean(rowNode.childrenExpanded) }
        : {}),
    }),
    [rowNode, currentLevelIds, filteredDescendantCount],
  );

  return <DataGridRow {...ariaAttributes} {...props} />;
}
