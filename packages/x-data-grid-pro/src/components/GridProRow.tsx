import * as React from 'react';
import {
  GridRow as DataGridRow,
  GridRowId,
  GridRowProps,
  GridTreeNode,
  gridExpandedSortedRowIdsLookupSelector,
  gridFilteredDescendantCountLookupSelector,
} from '@mui/x-data-grid';
import { useGridPrivateApiContext, useGridSelector } from '@mui/x-data-grid/internals';

export type GridTreeNodeWithParent = GridTreeNode & { parent: GridRowId };
export interface GridRowProProps extends GridRowProps {
  rowNode: GridTreeNodeWithParent;
}

export function GridRowPro(props: GridRowProProps) {
  const { rowNode, ...other } = props;

  const apiRef = useGridPrivateApiContext();
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

  return <DataGridRow {...ariaAttributes} {...other} />;
}
