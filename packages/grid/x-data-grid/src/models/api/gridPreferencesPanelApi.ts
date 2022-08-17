import { GridPreferencePanelsValue } from '../../hooks/features/preferencesPanel/gridPreferencePanelsValue';

/**
 * The preferences panel API interface that is available in the grid [[apiRef]].
 */
export interface GridPreferencesPanelApi {
  /**
   * Displays the preferences panel. The `newValue` argument controls the content of the panel.
   * @param {GridPreferencePanelsValue} newValue The panel to open. Use `"filters"` or `"columns"`.

   * @param {Object?} ids Object containing button and panel ids
   * @param {string?} ids.panelId The unique panel id
   * @param {string?} ids.buttonId The unique button id
   */
  showPreferences: (
    newValue: GridPreferencePanelsValue,
    ids?: {
      panelId?: string;
      buttonId?: string;
    },
  ) => void;
  /**
   * Hides the preferences panel.
   */
  hidePreferences: () => void;
}
