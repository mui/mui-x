import * as React from 'react';
import { GridRowId } from '../../../models/gridRows';
import { GridRowInternalHook } from '../../../models/configuration/gridRowConfiguration';
import { selectedIdsLookupSelector } from '../rowSelection';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../columnGrouping/gridColumnGroupsSelector';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';

export const useGridRowAriaAttributes: GridRowInternalHook = () => {
  const apiRef = useGridPrivateApiContext();
  const selectedIdsLookup = useGridSelector(apiRef, selectedIdsLookupSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);

  return React.useCallback(
    (rowId: GridRowId, index: number) => {
      const rowNode = apiRef.current.getRowNode(rowId);
      const ariaAttributes = {} as Record<string, string | number | boolean>;

      if (rowNode === null) {
        return ariaAttributes;
      }

      const ariaRowIndex = index + headerGroupingMaxDepth + 2; // 1 for the header row and 1 as it's 1-based
      ariaAttributes['aria-rowindex'] = ariaRowIndex;

      if (selectedIdsLookup[rowId]) {
        ariaAttributes['aria-selected'] = true;
      }

      return ariaAttributes;
    },
    [apiRef, selectedIdsLookup, headerGroupingMaxDepth],
  );
};
