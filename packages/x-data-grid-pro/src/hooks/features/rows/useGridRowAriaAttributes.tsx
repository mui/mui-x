import * as React from 'react';
import {
  GridRowId,
  useGridSelector,
  gridFilteredTopLevelRowCountSelector,
  gridFilteredDescendantCountLookupSelector,
  gridExpandedSortedRowIdsLookupSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid';
import { useGridRowAriaAttributes as useGridRowAriaAttributesCommunity } from '@mui/x-data-grid/internals';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';

export const useGridRowAriaAttributes = () => {
  const apiRef = useGridPrivateApiContext();
  const props = useGridRootProps();
  const { getRowAriaAttributes: getRowAriaAttributesCommunity } =
    useGridRowAriaAttributesCommunity();

  const filteredTopLevelRowCount = useGridSelector(apiRef, gridFilteredTopLevelRowCountSelector);
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );
  const sortedVisibleRowPositionsLookup = useGridSelector(
    apiRef,
    gridExpandedSortedRowIdsLookupSelector,
  );

  const getRowAriaAttributes = React.useCallback(
    (rowId: GridRowId, index: number) => {
      const rowNode = apiRef.current.getRowNode(rowId);
      const ariaAttributes = getRowAriaAttributesCommunity(rowId, index);

      if (rowNode === null || props.treeData !== true) {
        return ariaAttributes;
      }

      ariaAttributes['aria-level'] = rowNode.depth + 1;

      const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;
      // aria-expanded should only be added to the rows that contain children
      if (rowNode.type === 'group' && filteredDescendantCount > 0) {
        ariaAttributes['aria-expanded'] = Boolean(rowNode.childrenExpanded);
      }

      // if the parent is null, set size and position cannot be determined
      if (rowNode.parent !== null) {
        ariaAttributes['aria-setsize'] =
          rowNode.parent === GRID_ROOT_GROUP_ID
            ? filteredTopLevelRowCount
            : filteredDescendantCountLookup[rowNode.parent];
        ariaAttributes['aria-posinset'] = sortedVisibleRowPositionsLookup[rowNode.id];
      }

      return ariaAttributes;
    },
    [
      apiRef,
      props.treeData,
      filteredTopLevelRowCount,
      filteredDescendantCountLookup,
      sortedVisibleRowPositionsLookup,
      getRowAriaAttributesCommunity,
    ],
  );

  return { getRowAriaAttributes };
};
