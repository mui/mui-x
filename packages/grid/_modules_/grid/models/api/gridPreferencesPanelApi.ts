import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';

/**
 * The preferences panel API interface that is available in the grid [[apiRef]].
 */
export interface GridPreferencesPanelApi {
  /**
   * Displays the preferences panel. The `newValue` argument controls the content of the panel.
   * @param {GridPreferencePanelsValue} newValue The panel to open. Use `"filters"` or `"columns"`.
   */
  showPreferences: (newValue: GridPreferencePanelsValue) => void;
  /**
   * Hides the preferences panel.
   */
  hidePreferences: () => void;
}
