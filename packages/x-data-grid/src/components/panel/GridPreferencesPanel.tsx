import * as React from 'react';
import { gridColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridPreferencesPanelProps {
  /**
   * Type of the panel.
   */
  type: GridPreferencePanelsValue;
  /**
   * Anchor element for the panel.
   */
  anchorEl: HTMLButtonElement | null;
}

export function GridPreferencesPanel({ type, anchorEl }: GridPreferencesPanelProps) {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const rootProps = useGridRootProps();
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const isOpen =
    columns.length > 0 &&
    preferencePanelState.open &&
    type === preferencePanelState.openedPanelValue;

  const panelContent = apiRef.current.unstable_applyPipeProcessors('preferencePanel', null, type);

  return (
    <rootProps.slots.panel
      as={rootProps.slots.basePopper}
      open={isOpen}
      id={preferencePanelState.panelId}
      aria-labelledby={preferencePanelState.labelId}
      anchorEl={anchorEl}
      {...rootProps.slotProps?.panel}
      {...rootProps.slotProps?.basePopper}
    >
      {panelContent}
    </rootProps.slots.panel>
  );
}
