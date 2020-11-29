import { PreferencePanelsValue } from '../../hooks/features/preferencesPanel/preferencesPanelValue';

/**
 * The PreferencesPanel API interface that is available in the grid [[apiRef]].
 */
export interface PreferencesPanelApi {
  /**
   * Display the preferences panel with the PreferencePanelsValue opened.
   * @param newValue
   */
  showPreferences: (newValue: PreferencePanelsValue) => void;
  /**
   * Hide the preferences panel.
   */
  hidePreferences: () => void;
}
