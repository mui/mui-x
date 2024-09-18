import * as React from 'react';
import { gridColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

interface GridPreferencesPanelProps {
  /**
   * Ref for the filter button.
   */
  filterButtonRef: React.RefObject<HTMLButtonElement>;
  /**
   * Ref for the column button.
   */
  columnsButtonRef: React.RefObject<HTMLButtonElement>;
}

export function GridPreferencesPanel({
  filterButtonRef,
  columnsButtonRef,
}: GridPreferencesPanelProps) {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const rootProps = useGridRootProps();
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);

  const panelContent = apiRef.current.unstable_applyPipeProcessors(
    'preferencePanel',
    null,
    preferencePanelState.openedPanelValue ?? GridPreferencePanelsValue.filters,
  );

  const anchorEl =
    preferencePanelState.openedPanelValue === GridPreferencePanelsValue.filters
      ? filterButtonRef.current
      : columnsButtonRef.current;

  return (
    <rootProps.slots.panel
      as={rootProps.slots.basePopper}
      open={columns.length > 0 && preferencePanelState.open}
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
