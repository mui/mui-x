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

  const ariaLabel = rootProps['aria-label'];
  const ariaLabelledby = rootProps['aria-labelledby'];
  // `aria-label` and `aria-labelledby` should take precedence over `label`
  const shouldUseLabelAsAriaLabel = !ariaLabel && !ariaLabelledby && rootProps.label;

  return {
    role: 'grid',
    'aria-label': shouldUseLabelAsAriaLabel ? rootProps.label : ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-colcount': visibleColumns.length,
    'aria-rowcount': headerGroupingMaxDepth + 1 + pinnedRowsCount + accessibleRowCount,
    'aria-multiselectable': isMultipleRowSelectionEnabled(rootProps),
  };
};
