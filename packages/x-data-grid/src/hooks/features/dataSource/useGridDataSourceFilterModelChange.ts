'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import type { RefObject } from '@mui/x-internals/types';
import { gridColumnLookupSelector } from '../columns';
import { removeIncompleteFilterItems } from '../filter/gridFilterUtils';
import { gridGetRowsParamsSelector } from './gridDataSourceSelector';
import type { GridFilterModel } from '../../../models/gridFilterModel';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * Tracks the filter model as the data source sees it, incomplete items excluded.
 * Returns a predicate telling whether a new model differs from the last fetched one:
 * adding or editing an incomplete item leaves the params untouched, so no fetch is needed.
 */
export const useGridDataSourceFilterModelChange = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const lastFetchedFilterModel = useLazyRef<GridFilterModel, void>(
    () => gridGetRowsParamsSelector(apiRef).filterModel,
  );

  return React.useCallback(
    (filterModel: GridFilterModel) => {
      const prunedFilterModel = removeIncompleteFilterItems(
        filterModel,
        gridColumnLookupSelector(apiRef),
      );
      if (isDeepEqual(prunedFilterModel, lastFetchedFilterModel.current)) {
        return false;
      }
      lastFetchedFilterModel.current = prunedFilterModel;
      return true;
    },
    [apiRef, lastFetchedFilterModel],
  );
};
