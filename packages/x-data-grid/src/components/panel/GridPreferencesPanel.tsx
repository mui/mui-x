import * as React from 'react';
import { gridColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export function GridPreferencesPanel() {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const rootProps = useGridRootProps();
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const panelContent = apiRef.current.unstable_applyPipeProcessors(
    'preferencePanel',
    null,
    preferencePanelState.openedPanelValue ?? GridPreferencePanelsValue.filters,
  );

  return (
    <rootProps.slots.panel
      as={rootProps.slots.basePopper}
      open={columns.length > 0 && preferencePanelState.open}
      id={preferencePanelState.panelId}
      aria-labelledby={preferencePanelState.labelId}
      {...rootProps.slotProps?.panel}
      {...rootProps.slotProps?.basePopper}
    >
      {panelContent}
    </rootProps.slots.panel>
  );
}
