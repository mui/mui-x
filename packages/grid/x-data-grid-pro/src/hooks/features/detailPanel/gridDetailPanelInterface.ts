import * as React from 'react';
import { GridRowId } from '@mui/x-data-grid';

type DetailPanelHeightCache = Record<GridRowId, { autoHeight: boolean; height: number }>;

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

export interface GridDetailPanelPrivateApi {
  /**
   * Stores the panel height measurement and triggers the row height pre-processing.
   * @param {GridRowId} id The id of the row.
   * @param {number} height The new height.
   */
  storeDetailPanelHeight: (id: GridRowId, height: number) => void;
  /**
   * Determines if the height of a detail panel is "auto".
   * @param {GridRowId} id The id of the row.
   * @returns {boolean} `true` if the detail panel height is "auto".
   */
  detailPanelHasAutoHeight: (id: GridRowId) => boolean;
}

export interface GridDetailPanelState {
  expandedRowIds: GridRowId[];
  contentCache: Record<GridRowId, React.ReactNode>;
  heightCache: DetailPanelHeightCache;
}

export type GridDetailPanelInitialState = Pick<GridDetailPanelState, 'expandedRowIds'>;
