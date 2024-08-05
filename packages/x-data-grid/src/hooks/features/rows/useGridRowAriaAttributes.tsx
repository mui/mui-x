import * as React from 'react';
import { GridTreeNode } from '../../../models/gridRows';
import { GetRowAriaAttributesFn } from '../../../models/configuration/gridRowConfiguration';
import { selectedIdsLookupSelector } from '../rowSelection';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../columnGrouping/gridColumnGroupsSelector';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';

export const useGridRowAriaAttributes = (): GetRowAriaAttributesFn => {
  const apiRef = useGridPrivateApiContext();
  const selectedIdsLookup = useGridSelector(apiRef, selectedIdsLookupSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);

  return React.useCallback(
    (rowNode: GridTreeNode, index: number) => {
      const ariaAttributes = {} as Record<string, string | number | boolean>;

      const ariaRowIndex = index + headerGroupingMaxDepth + 2; // 1 for the header row and 1 as it's 1-based
      ariaAttributes['aria-rowindex'] = ariaRowIndex;

      if (apiRef.current.isRowSelectable(rowNode.id)) {
        ariaAttributes['aria-selected'] = selectedIdsLookup[rowNode.id] !== undefined;
      }

      return ariaAttributes;
    },
    [apiRef, selectedIdsLookup, headerGroupingMaxDepth],
  );
};
