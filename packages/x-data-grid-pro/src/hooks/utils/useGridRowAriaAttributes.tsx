import * as React from 'react';
import {
  GridRowId,
  gridExpandedSortedRowIdsLookupSelector,
  gridFilteredDescendantCountLookupSelector,
} from '@mui/x-data-grid';
import { useGridSelector } from '@mui/x-data-grid/internals';
import { useGridRootProps } from './useGridRootProps';
import { useGridPrivateApiContext } from './useGridPrivateApiContext';

interface GridRowAriaAttributes {
  'aria-level'?: number;
  'aria-setsize'?: number;
  'aria-posinset'?: number;
  'aria-expanded'?: boolean;
}

export const useGridRowAriaAttributes = () => {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  );
  const sortedVisibleRowIdsLookup = useGridSelector(apiRef, gridExpandedSortedRowIdsLookupSelector);

  const getGridRowAriaAttributes = React.useCallback<(rowId: GridRowId) => GridRowAriaAttributes>(
    (rowId) => {
      const rowNode = apiRef.current.getRowNode(rowId);
      const ariaAttributes: GridRowAriaAttributes = {};

      if (rootProps.treeData !== true || rowNode === null) {
        return ariaAttributes;
      }

      ariaAttributes['aria-level'] = rowNode.depth + 1;

      // aria-expanded should only be added to the rows that contain children
      const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0;
      if (rowNode.type === 'group' && filteredDescendantCount > 0) {
        ariaAttributes['aria-expanded'] = Boolean(rowNode.childrenExpanded);
      }

      // if the parent is null, set size and position cannot be determined
      if (rowNode.parent !== null) {
        const currentLevelIds = sortedVisibleRowIdsLookup[rowNode.parent];
        ariaAttributes['aria-setsize'] = currentLevelIds.length;
        ariaAttributes['aria-posinset'] = currentLevelIds.indexOf(rowNode.id) + 1;
      }

      return ariaAttributes;
    },
    [apiRef, rootProps.treeData, filteredDescendantCountLookup, sortedVisibleRowIdsLookup],
  );

  return {
    getGridRowAriaAttributes,
  };
};
