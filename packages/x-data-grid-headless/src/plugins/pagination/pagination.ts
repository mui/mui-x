'use client';
import * as React from 'react';
import { type Plugin, createPlugin } from '../core/plugin';
import type { GridRowId } from '../internal/rows/rowUtils';
import { paginationSelectors } from './selectors';
import {
  getDefaultPaginationModel,
  getPageCount,
  getValidPage,
  paginateRowIds,
} from './paginationUtils';
import type {
  PaginationModel,
  PaginationState,
  PaginationOptions,
  PaginationInternalOptions,
  PaginationApi,
  PaginationSelectors,
} from './types';

type PaginationPluginOptions = PaginationOptions & PaginationInternalOptions;

type PaginationPlugin = Plugin<
  'pagination',
  PaginationState,
  PaginationSelectors,
  PaginationApi,
  PaginationPluginOptions
>;

const paginationPlugin = createPlugin<PaginationPlugin>()({
  name: 'pagination',
  selectors: paginationSelectors,

  initialize: (state, params) => {
    // Prefer controlled model over initialState over defaults
    const initialModel =
      params.pagination?.model ??
      params.initialState?.pagination?.model ??
      getDefaultPaginationModel();

    const isExternal = params.pagination?.external === true;

    // Check if sorting plugin has run and produced sortedRowIds
    const sortingState = (state as Record<string, any>).sorting as
      | { sortedRowIds: GridRowId[] }
      | undefined;
    const sourceRowIds: GridRowId[] = sortingState?.sortedRowIds ?? state.rows.dataRowIds;

    // Determine row count
    const rowCount = isExternal
      ? (params.pagination?.rowCount ?? sourceRowIds.length)
      : sourceRowIds.length;

    const pageCount = getPageCount(rowCount, initialModel.pageSize, initialModel.page);
    const validPage = getValidPage(initialModel.page, pageCount);
    const validatedModel: PaginationModel =
      validPage !== initialModel.page ? { ...initialModel, page: validPage } : initialModel;

    // In external mode, don't slice — the provided rows are already the current page
    const paginatedRowIds = isExternal
      ? sourceRowIds
      : paginateRowIds(sourceRowIds, validatedModel);

    return {
      ...state,
      pagination: {
        model: validatedModel,
        rowCount,
        pageCount,
        paginatedRowIds,
      },
    };
  },

  use: (store, params, api) => {
    const isExternal = (): boolean => {
      return params.pagination?.external === true;
    };

    const getSourceRowIds = (): GridRowId[] => {
      // Check if sorting plugin state exists (optional dependency)
      const sortingState = (store.state as Record<string, any>).sorting as
        | { sortedRowIds: GridRowId[] }
        | undefined;
      if (sortingState?.sortedRowIds) {
        return sortingState.sortedRowIds;
      }
      return api.rows.getAllRowIds();
    };

    const recomputePaginationFromSource = (
      sourceRowIds: GridRowId[],
      model: PaginationModel,
    ): void => {
      const external = isExternal();

      const rowCount = external
        ? (params.pagination?.rowCount ?? sourceRowIds.length)
        : sourceRowIds.length;

      const pageCount = getPageCount(rowCount, model.pageSize, model.page);
      const validPage = getValidPage(model.page, pageCount);
      const validatedModel: PaginationModel =
        validPage !== model.page ? { ...model, page: validPage } : model;

      const paginatedRowIds = external
        ? sourceRowIds
        : paginateRowIds(sourceRowIds, validatedModel);

      store.setState({
        ...store.state,
        pagination: {
          model: validatedModel,
          rowCount,
          pageCount,
          paginatedRowIds,
        },
      });

      params.pagination?.onPaginatedRowsSet?.(paginatedRowIds);
    };

    const recomputePagination = (model: PaginationModel): void => {
      recomputePaginationFromSource(getSourceRowIds(), model);
    };

    const getModel = (): PaginationModel => {
      return store.state.pagination.model;
    };

    const setModel = (model: PaginationModel): void => {
      const prevModel = store.state.pagination.model;

      recomputePagination(model);

      // Call callback if model changed
      const currentModel = store.state.pagination.model;
      if (prevModel !== currentModel) {
        params.pagination?.onModelChange?.(currentModel);
      }
    };

    const setPage = (page: number): void => {
      const current = getModel();
      setModel({ ...current, page });
    };

    const setPageSize = (pageSize: number): void => {
      setModel({ page: 0, pageSize });
    };

    // Subscribe to store changes to detect when source row IDs change.
    // This is needed because sorting or rows may update the store outside
    // of React's render cycle, and we need to react synchronously.
    const prevSourceRowIdsRef = React.useRef<GridRowId[]>(getSourceRowIds());

    React.useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        const currentSourceRowIds = getSourceRowIds();

        if (prevSourceRowIdsRef.current !== currentSourceRowIds) {
          prevSourceRowIdsRef.current = currentSourceRowIds;
          recomputePaginationFromSource(currentSourceRowIds, store.state.pagination.model);
        }
      });
      return unsubscribe;
      // eslint-disable-next-line react-hooks/exhaustive-deps -- subscribe once on mount
    }, []);

    // Handle controlled pagination.model prop changes
    const prevModelRef = React.useRef<PaginationModel | undefined>(params.pagination?.model);

    React.useEffect(() => {
      if (params.pagination?.model !== undefined) {
        const currentModel = store.state.pagination.model;
        if (
          params.pagination.model !== currentModel &&
          params.pagination.model !== prevModelRef.current
        ) {
          prevModelRef.current = params.pagination.model;
          recomputePagination(params.pagination.model);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only reacting to pagination.model prop changes
    }, [params.pagination?.model]);

    return {
      pagination: {
        getModel,
        setModel,
        setPage,
        setPageSize,
      },
    };
  },
});

export default paginationPlugin;
