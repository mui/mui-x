'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import type { RefObject } from '@mui/x-internals/types';
import { gridColumnLookupSelector } from '../columns';
import type { GridColumnLookup } from '../columns';
import { gridFilterModelSelector } from '../filter/gridFilterSelector';
import { getDefaultGridFilterModel } from '../filter/gridFilterState';
import { removeIncompleteFilterItems } from '../filter/gridFilterUtils';
import type { GridFilterModel } from '../../../models/gridFilterModel';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * The parts of a filter model that can change the rows the data source returns, so that a
 * change to the rest is not mistaken for a new query. A logic operator needs two operands to
 * mean anything, and quick filter values only apply once one of them is truthy
 * (`buildAggregatedQuickFilterApplier` returns `null` otherwise).
 * Falsy values are kept when another one applies: `passFilterLogic` runs the whole array
 * through its logic operator, so `['a', '']` and `['a']` do not match the same rows.
 */
const getApplicableFilterModel = (model: GridFilterModel, columnsLookup: GridColumnLookup) => {
  const defaultModel = getDefaultGridFilterModel();
  const { items } = removeIncompleteFilterItems(model, columnsLookup);
  const appliesQuickFilter = model.quickFilterValues?.some(Boolean) ?? false;
  const quickFilterValues = appliesQuickFilter ? (model.quickFilterValues ?? []) : [];

  return {
    items,
    logicOperator: items.length > 1 ? (model.logicOperator ?? defaultModel.logicOperator) : null,
    quickFilterValues,
    quickFilterLogicOperator:
      quickFilterValues.length > 1
        ? (model.quickFilterLogicOperator ?? defaultModel.quickFilterLogicOperator)
        : null,
    quickFilterExcludeHiddenColumns: appliesQuickFilter
      ? (model.quickFilterExcludeHiddenColumns ?? defaultModel.quickFilterExcludeHiddenColumns)
      : null,
  };
};

/**
 * Tracks the filter model as the data source sees it, the parts that cannot apply excluded.
 * Returns a predicate telling whether a new model would ask for something else: editing an
 * incomplete item, or flipping a logic operator that has nothing to combine, is a no-op.
 */
export const useGridDataSourceFilterModelChange = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const lastFetchedFilterModel = useLazyRef(() =>
    getApplicableFilterModel(gridFilterModelSelector(apiRef), gridColumnLookupSelector(apiRef)),
  );

  return React.useCallback(
    (filterModel: GridFilterModel) => {
      const applicableFilterModel = getApplicableFilterModel(
        filterModel,
        gridColumnLookupSelector(apiRef),
      );
      if (isDeepEqual(applicableFilterModel, lastFetchedFilterModel.current)) {
        return false;
      }
      lastFetchedFilterModel.current = applicableFilterModel;
      return true;
    },
    [apiRef, lastFetchedFilterModel],
  );
};
