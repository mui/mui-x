import type { GridRowId } from '../internal/rows/types';

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
