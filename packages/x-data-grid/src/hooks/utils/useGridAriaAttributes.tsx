import * as React from 'react';
import { gridVisibleColumnDefinitionsSelector } from '../features/columns/gridColumnsSelector';
import { useGridSelector } from './useGridSelector';
import { useGridRootProps } from './useGridRootProps';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../features/columnGrouping/gridColumnGroupsSelector';
import { gridPinnedRowsCountSelector } from '../features/rows/gridRowsSelector';
import { useGridPrivateApiContext } from './useGridPrivateApiContext';
import { isMultipleRowSelectionEnabled } from '../features/rowSelection/utils';
import { gridExpandedRowCountSelector } from '../features/filter/gridFilterSelector';

export const useGridAriaAttributes = (): React.HTMLAttributes<HTMLElement> => {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const accessibleRowCount = useGridSelector(apiRef, gridExpandedRowCountSelector);
  const headerGroupingMaxDepth = useGridSelector(apiRef, gridColumnGroupsHeaderMaxDepthSelector);
  const pinnedRowsCount = useGridSelector(apiRef, gridPinnedRowsCountSelector);

  const generatedLabelId = 'data-grid-label';
  const isLabelPropVisible = rootProps.showToolbar && !!rootProps.label;
  const isLabelPropHidden = !rootProps.showToolbar && !!rootProps.label;
  const ariaLabelledBy =
    rootProps['aria-labelledby'] || (isLabelPropVisible ? generatedLabelId : undefined);
  const ariaLabel = rootProps['aria-label'] || (isLabelPropHidden ? rootProps.label : undefined);

  return {
    role: 'grid',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-colcount': visibleColumns.length,
    'aria-rowcount': headerGroupingMaxDepth + 1 + pinnedRowsCount + accessibleRowCount,
    'aria-multiselectable': isMultipleRowSelectionEnabled(rootProps),
  };
};
