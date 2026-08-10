'use client';
import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import type { RefObject } from '@mui/x-internals/types';
import { gridGetRowsParamsSelector } from './gridDataSourceSelector';
import type { GridFilterModel } from '../../../models/gridFilterModel';
import type { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

/**
 * Tracks the filter model as the data source sees it, incomplete items excluded.
 * Returns a getter for the current model, or `null` when it matches the last fetched one:
 * adding or editing an incomplete item leaves the params untouched, so no fetch is needed.
 */
export const useGridDataSourceFilterModelChange = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const lastFetchedFilterModel = useLazyRef<GridFilterModel, void>(
    () => gridGetRowsParamsSelector(apiRef).filterModel,
  );

  return React.useCallback(() => {
    const filterModel = gridGetRowsParamsSelector(apiRef).filterModel;
    if (isDeepEqual(filterModel, lastFetchedFilterModel.current)) {
      return null;
    }
    lastFetchedFilterModel.current = filterModel;
    return filterModel;
  }, [apiRef, lastFetchedFilterModel]);
};
