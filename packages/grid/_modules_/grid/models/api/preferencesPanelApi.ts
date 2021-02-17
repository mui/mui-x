import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';

/**
 * The PreferencesPanel API interface that is available in the grid [[apiRef]].
 */
export interface PreferencesPanelApi {
  /**
   * Display the preferences panel with the GridPreferencePanelsValue opened.
   * @param newValue
   */
  showPreferences: (newValue: GridPreferencePanelsValue) => void;
  /**
   * Hide the preferences panel.
   */
  hidePreferences: () => void;
}
