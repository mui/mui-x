import type { GridRowId } from '../internal/rows/rowUtils';

export interface PaginationModel {
  page: number;
  pageSize: number;
}

export interface PaginationState {
  pagination: {
    model: PaginationModel;
    rowCount: number;
    pageCount: number;
    paginatedRowIds: GridRowId[];
  };
}

export interface PaginationOptions {
  initialState?: {
    pagination?: {
      model?: PaginationModel;
    };
  };

  pagination?: {
    /** The pagination model for controlled mode. */
    model?: PaginationModel;

    /**
     * Callback fired when the pagination model changes.
     * @param {PaginationModel} model The new pagination model.
     */
    onModelChange?: (model: PaginationModel) => void;

    /**
     * The total number of rows. Set to -1 for unknown row count.
     * Used in external pagination mode.
     */
    rowCount?: number;

    /**
     * Estimated total row count when rowCount is unknown (-1).
     */
    estimatedRowCount?: number;
  };
}

/**
 * Internal options for the pagination plugin.
 */
export interface PaginationInternalOptions {
  pagination?: {
    /** If true, pagination is handled externally (e.g., server-side). */
    external?: boolean;
  };
}

export type PaginationSelectors = {
  model: (state: PaginationState) => PaginationModel;
  paginatedRowIds: (state: PaginationState) => GridRowId[];
  pageCount: (state: PaginationState) => number;
  rowCount: (state: PaginationState) => number;
};

export interface PaginationApi {
  pagination: {
    /**
     * Get the current pagination model.
     * @returns {PaginationModel} The current pagination model.
     */
    getModel: () => PaginationModel;

    /**
     * Set the pagination model.
     * @param {PaginationModel} model The new pagination model.
     */
    setModel: (model: PaginationModel) => void;

    /**
     * Set the current page.
     * @param {number} page The page to navigate to.
     */
    setPage: (page: number) => void;

    /**
     * Set the page size. Resets to page 0.
     * @param {number} pageSize The new page size.
     */
    setPageSize: (pageSize: number) => void;
  };
}
