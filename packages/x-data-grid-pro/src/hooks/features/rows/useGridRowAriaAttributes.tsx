import * as React from 'react';
import {
  GridTreeNode,
  useGridSelector,
  gridFilteredTopLevelRowCountSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid';
import {
  useGridRowAriaAttributes as useGridRowAriaAttributesCommunity,
  gridFilteredChildrenCountLookupSelector,
  gridExpandedSortedRowTreeLevelPositionLookupSelector,
} from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';

export const useGridRowAriaAttributes = (addTreeDataAttributes?: boolean) => {
  const apiRef = useGridPrivateApiContext();
  const props = useGridRootProps();
  const getRowAriaAttributesCommunity = useGridRowAriaAttributesCommunity();

  const filteredTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  const filteredChildrenCountLookup = useGridSelector(
    apiRef,
    gridFilteredChildrenCountLookupSelector,
  );
  const sortedVisibleRowPositionsLookup = useGridSelector(
    apiRef,
    gridExpandedSortedRowTreeLevelPositionLookupSelector,
  );

  return React.useCallback(
    (rowNode: GridTreeNode, index: number) => {
      const ariaAttributes = getRowAriaAttributesCommunity(rowNode, index);

      if (rowNode === null || !(props.treeData || addTreeDataAttributes)) {
        return ariaAttributes;
      }

      // pinned and footer rows are not part of the rowgroup and should not get the set specific aria attributes
      if (rowNode.type === 'footer' || rowNode.type === 'pinnedRow') {
        return ariaAttributes;
      }

      ariaAttributes['aria-level'] = rowNode.depth + 1;

      const filteredChildrenCount = filteredChildrenCountLookup[rowNode.id] ?? 0;
      // aria-expanded should only be added to the rows that contain children
      if (rowNode.type === 'group' && filteredChildrenCount > 0) {
        ariaAttributes['aria-expanded'] = Boolean(rowNode.childrenExpanded);
      }

      // if the parent is null, set size and position cannot be determined
      if (rowNode.parent !== null) {
        ariaAttributes['aria-setsize'] =
          rowNode.parent === GRID_ROOT_GROUP_ID
            ? filteredTopLevelRowCount
            : filteredChildrenCountLookup[rowNode.parent];
        ariaAttributes['aria-posinset'] = sortedVisibleRowPositionsLookup[rowNode.id];
      }

      return ariaAttributes;
    },
    [
      props.treeData,
      addTreeDataAttributes,
      filteredTopLevelRowCount,
      filteredChildrenCountLookup,
      sortedVisibleRowPositionsLookup,
      getRowAriaAttributesCommunity,
    ],
  );
};
