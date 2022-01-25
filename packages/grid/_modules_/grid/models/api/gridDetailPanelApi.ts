import { GridRowId } from '../gridRows';

/**
 * The master/detail API interface that is available in the grid [[apiRef]].
 */
export interface GridDetailPanelApi {
  /**
   * Expands or collapses the detail panel of a row.
   * @param {string} id The row id to toggle the panel.
   */
  toggleDetailPanel: (id: GridRowId) => void;
  /**
   * Returns the rows whose detail panel is open.
   * @returns {GridRowId[]} An array of row ids.
   */
  getExpandedDetailPanels: () => GridRowId[];
  /**
   * Changes which rows to expand the detail panel.
   * @param {GridRowId[]} ids The ids of the rows to open the detail panel.
   */
  setExpandedDetailPanels: (ids: GridRowId[]) => void;
}
