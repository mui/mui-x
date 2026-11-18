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
  let fallbackLabel: string | undefined;
  switch (preferencePanelState.openedPanelValue) {
    case GridPreferencePanelsValue.filters:
      target = triggers.filterPanel.element;
      fallbackLabel = apiRef.current.getLocaleText('toolbarFiltersLabel');
      break;
    case GridPreferencePanelsValue.columns:
      target = triggers.columnsPanel.element;
      fallbackLabel = apiRef.current.getLocaleText('toolbarColumnsLabel');
      break;
    case GridPreferencePanelsValue.aiAssistant:
      target = triggers.aiAssistantPanel.element;
      fallbackLabel = apiRef.current.getLocaleText('aiAssistantPanelTitle');
      break;
    default:
  }

  // The panel is a dialog, so it needs an accessible name even when it was opened
  // without a trigger (column menu items, `GridNoColumnsOverlay`, `showFilterPanel()`, ...)
  const labelProps = preferencePanelState.labelId
    ? { 'aria-labelledby': preferencePanelState.labelId }
    : { 'aria-label': fallbackLabel };

  return (
    <rootProps.slots.panel
      id={preferencePanelState.panelId}
      open={columns.length > 0 && preferencePanelState.open}
      {...labelProps}
      target={target}
      onClose={() => apiRef.current.hidePreferences()}
      {...rootProps.slotProps?.panel}
    >
      {panelContent}
    </rootProps.slots.panel>
  );
}
