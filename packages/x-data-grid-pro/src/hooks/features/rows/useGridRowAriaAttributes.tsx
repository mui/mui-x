import * as React from 'react';
import {
  GridRowId,
  useGridSelector,
  gridFilteredTopLevelRowCountSelector,
  gridFilteredChildrenCountLookupSelector,
  gridExpandedSortedRowIdsLookupSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid';
import { useGridRowAriaAttributes as useGridRowAriaAttributesCommunity } from '@mui/x-data-grid/internals';
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
    gridExpandedSortedRowIdsLookupSelector,
  );

  const addAttributes =
    addTreeDataAttributes !== undefined ? addTreeDataAttributes : props.treeData === true;

  return React.useCallback(
    (rowId: GridRowId, index: number) => {
      const rowNode = apiRef.current.getRowNode(rowId);
      const ariaAttributes = getRowAriaAttributesCommunity(rowId, index);

      if (!addAttributes || rowNode === null) {
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
      apiRef,
      addAttributes,
      filteredTopLevelRowCount,
      filteredChildrenCountLookup,
      sortedVisibleRowPositionsLookup,
      getRowAriaAttributesCommunity,
    ],
  );
};
