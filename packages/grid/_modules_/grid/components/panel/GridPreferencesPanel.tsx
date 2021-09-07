import * as React from 'react';
import { allGridColumnsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/root/useGridApiContext';
import { useGridRootProps } from '../../hooks/root/useGridRootProps';

export const GridPreferencesPanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridPreferencesPanel(props, ref) {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, allGridColumnsSelector);
  const rootProps = useGridRootProps();
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const isColumnsTabOpen =
    preferencePanelState.openedPanelValue === GridPreferencePanelsValue.columns;
  const isFiltersTabOpen = !preferencePanelState.openedPanelValue || !isColumnsTabOpen;

  return (
    <rootProps.components.Panel
      ref={ref}
      open={columns.length > 0 && preferencePanelState.open}
      {...rootProps.componentsProps?.panel}
      {...props}
    >
      {!rootProps.disableColumnSelector && isColumnsTabOpen && (
        <rootProps.components.ColumnsPanel {...rootProps.componentsProps?.columnsPanel} />
      )}
      {!rootProps.disableColumnFilter && isFiltersTabOpen && (
        <rootProps.components.FilterPanel {...rootProps.componentsProps?.filterPanel} />
      )}
    </rootProps.components.Panel>
  );
});
