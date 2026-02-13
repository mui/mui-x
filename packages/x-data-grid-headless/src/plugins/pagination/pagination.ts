'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { type Plugin, createPlugin } from '../core/plugin';
import type { GridRowId } from '../internal/rows/rowUtils';
import { paginationSelectors } from './selectors';
import {
  DEFAULT_PAGINATION_MODEL,
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
} from './types';

type PaginationPluginOptions = PaginationOptions & PaginationInternalOptions;

type PaginationPlugin = Plugin<
  'pagination',
  PaginationState,
  typeof paginationSelectors,
  PaginationApi,
  PaginationPluginOptions
>;

const PAGINATION_PIPELINE_PROCESSOR_NAME = 'pagination';

const paginationPlugin = createPlugin<PaginationPlugin>()({
  name: 'pagination',
  order: 50,
  selectors: paginationSelectors,

  initialize: (state, params) => {
    // Prefer controlled model over initialState over defaults
    const initialModel =
      params.pagination?.model ??
      params.initialState?.pagination?.model ??
      DEFAULT_PAGINATION_MODEL;

    const isExternal = params.pagination?.external === true;

    // Use processedRowIds which may already be sorted by an upstream plugin
    const sourceRowIds: GridRowId[] = state.rows.processedRowIds;

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
      rows: {
        ...state.rows,
        processedRowIds: paginatedRowIds,
      },
      pagination: {
        model: validatedModel,
        rowCount,
        pageCount,
        paginatedRowIds,
      },
    };
  },

  use: (store, params, api) => {
    const isExternalPagination = params.pagination?.external === true;

    const paginationProcessor = useStableCallback((inputIds: GridRowId[]): GridRowId[] => {
      if (isExternalPagination) {
        return inputIds;
      }

      const model = store.state.pagination.model;
      const rowCount = inputIds.length;
      const pageCount = getPageCount(rowCount, model.pageSize, model.page);
      const validPage = getValidPage(model.page, pageCount);
      const validatedModel: PaginationModel =
        validPage !== model.page ? { ...model, page: validPage } : model;

      const paginatedRowIds = paginateRowIds(inputIds, validatedModel);

      // Update pagination-specific state
      store.setState({
        ...store.state,
        pagination: {
          model: validatedModel,
          rowCount,
          pageCount,
          paginatedRowIds,
        },
      });

      return paginatedRowIds;
    });

    const applyPagination = useStableCallback((): void => {
      if (isExternalPagination) {
        return;
      }

      api.rows.rowIdsPipeline.recompute(PAGINATION_PIPELINE_PROCESSOR_NAME);
    });

    React.useEffect(() => {
      return api.rows.rowIdsPipeline.register(
        PAGINATION_PIPELINE_PROCESSOR_NAME,
        paginationProcessor,
        {
          disabled: isExternalPagination,
        },
      );
    }, [api, isExternalPagination, paginationProcessor]);

    const getModel = (): PaginationModel => {
      return store.state.pagination.model;
    };

    const setModel = (model: PaginationModel): void => {
      const prevModel = store.state.pagination.model;

      // Update model in state
      store.setState({
        ...store.state,
        pagination: {
          ...store.state.pagination,
          model,
        },
      });

      // Call callback if model changed
      if (prevModel !== model) {
        params.pagination?.onModelChange?.(model);
      }

      // Apply pagination through the pipeline
      if (!isExternalPagination) {
        applyPagination();
      }
    };

    const setPage = (page: number): void => {
      const current = getModel();
      setModel({ ...current, page });
    };

    const setPageSize = (pageSize: number): void => {
      setModel({ page: 0, pageSize });
    };

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
          // Update model in state without triggering callback (it's controlled)
          store.setState({
            ...store.state,
            pagination: {
              ...store.state.pagination,
              model: params.pagination.model,
            },
          });

          if (!isExternalPagination) {
            applyPagination();
          }
        }
      }
    }, [params.pagination?.model, store, isExternalPagination, applyPagination]);

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
