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
  getExpandedDetailPanels: () => Set<GridRowId>;
  /**
   * Changes which rows to expand the detail panel.
   * @param {GridRowId[]} ids The ids of the rows to open the detail panel.
   */
  setExpandedDetailPanels: (ids: Set<GridRowId>) => void;
}

export interface GridDetailPanelPrivateApi {
  /**
   * Stores the panel height measurement and triggers the row height pre-processing.
   * @param {GridRowId} id The id of the row.
   * @param {number} height The new height.
   */
  storeDetailPanelHeight: (id: GridRowId, height: number) => void;
}

export interface GridDetailPanelState {
  expandedRowIds: Set<GridRowId>;
  contentCache: Record<GridRowId, React.ReactNode>;
  heightCache: DetailPanelHeightCache;
}

export type GridDetailPanelInitialState = Pick<GridDetailPanelState, 'expandedRowIds'>;
