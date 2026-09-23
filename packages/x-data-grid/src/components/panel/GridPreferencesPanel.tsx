import { gridColumnDefinitionsSelector } from '../../hooks/features/columns/gridColumnsSelector';
import { useGridSelector } from '../../hooks/utils/useGridSelector';
import { gridPreferencePanelStateSelector } from '../../hooks/features/preferencesPanel/gridPreferencePanelSelector';
import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridPanelContext } from './GridPanelContext';

export function GridPreferencesPanel() {
  const apiRef = useGridApiContext();
  const columns = useGridSelector(apiRef, gridColumnDefinitionsSelector);
  const rootProps = useGridRootProps();
  const preferencePanelState = useGridSelector(apiRef, gridPreferencePanelStateSelector);
  const { triggers } = useGridPanelContext();

  const panelContent = apiRef.current.unstable_applyPipeProcessors(
    'preferencePanel',
    null,
    preferencePanelState.openedPanelValue ?? GridPreferencePanelsValue.filters,
  );

  let target: HTMLElement | null = null;
  switch (preferencePanelState.openedPanelValue) {
    case GridPreferencePanelsValue.filters:
      target = triggers.filterPanel.element;
      break;
    case GridPreferencePanelsValue.columns:
      target = triggers.columnsPanel.element;
      break;
    case GridPreferencePanelsValue.aiAssistant:
      target = triggers.aiAssistantPanel.element;
      break;
    default:
  }

  return (
    <rootProps.slots.panel
      id={preferencePanelState.panelId}
      open={columns.length > 0 && preferencePanelState.open}
      aria-labelledby={preferencePanelState.labelId}
      target={target}
      onClose={() => apiRef.current.hidePreferences()}
      {...rootProps.slotProps?.panel}
    >
      {panelContent}
    </rootProps.slots.panel>
  );
}
