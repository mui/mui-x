'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { GridColumnGroupingModel } from '../../../models/gridColumnGrouping';
import {
  gridColumnGroupsLookupSelector,
  gridColumnGroupsUnwrappedModelSelector,
} from './gridColumnGroupsSelector';
import { GridColumnGroupingApi } from '../../../models/api/gridColumnGroupingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import {
  createGroupLookup,
  getColumnGroupsHeaderStructure,
  unwrapGroupingColumnModel,
} from './gridColumnGroupsUtils';
import { useGridEvent } from '../../utils/useGridEvent';
import { GridEventListener } from '../../../models/events';
import { gridColumnFieldsSelector, gridVisibleColumnFieldsSelector } from '../columns';

export const columnGroupsStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'columnGroupingModel'>
> = (state, props, apiRef) => {
  apiRef.current.caches.columnGrouping = {
    lastColumnGroupingModel: props.columnGroupingModel,
  };
  if (!props.columnGroupingModel) {
    return {
      ...state,
      columnGrouping: undefined,
    };
  }

  const columnFields = gridColumnFieldsSelector(apiRef);
  const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);

  const groupLookup = createGroupLookup(props.columnGroupingModel ?? []);
  const unwrappedGroupingModel = unwrapGroupingColumnModel(props.columnGroupingModel ?? []);
  const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(
    columnFields,
    unwrappedGroupingModel,
    apiRef.current.state.pinnedColumns ?? {},
  );
  const maxDepth =
    visibleColumnFields.length === 0
      ? 0
      : Math.max(...visibleColumnFields.map((field) => unwrappedGroupingModel[field]?.length ?? 0));

  return {
    ...state,
    columnGrouping: {
      lookup: groupLookup,
      unwrappedGroupingModel,
      headerStructure: columnGroupsHeaderStructure,
      maxDepth,
    },
  };
};

/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
export const useGridColumnGrouping = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<DataGridProcessedProps, 'columnGroupingModel'>,
) => {
  /**
   * API METHODS
   */
  const getColumnGroupPath = React.useCallback<GridColumnGroupingApi['getColumnGroupPath']>(
    (field) => {
      const unwrappedGroupingModel = gridColumnGroupsUnwrappedModelSelector(apiRef);

      return unwrappedGroupingModel[field] ?? [];
    },
    [apiRef],
  );

  const getAllGroupDetails = React.useCallback<GridColumnGroupingApi['getAllGroupDetails']>(() => {
    const columnGroupLookup = gridColumnGroupsLookupSelector(apiRef);
    return columnGroupLookup;
  }, [apiRef]);

  const columnGroupingApi: GridColumnGroupingApi = {
    getColumnGroupPath,
    getAllGroupDetails,
  };

  useGridApiMethod(apiRef, columnGroupingApi, 'public');

  const handleColumnIndexChange = React.useCallback<GridEventListener<'columnIndexChange'>>(() => {
    const unwrappedGroupingModel = unwrapGroupingColumnModel(props.columnGroupingModel ?? []);

    apiRef.current.setState((state) => {
      const orderedFields = state.columns?.orderedFields ?? [];

      const pinnedColumns = state.pinnedColumns ?? {};

      const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(
        orderedFields as string[],
        unwrappedGroupingModel,
        pinnedColumns,
      );
      return {
        ...state,
        columnGrouping: {
          ...state.columnGrouping,
          headerStructure: columnGroupsHeaderStructure,
        },
      };
    });
  }, [apiRef, props.columnGroupingModel]);

  const updateColumnGroupingState = React.useCallback(
    (columnGroupingModel: GridColumnGroupingModel | undefined) => {
      if (!columnGroupingModel && !apiRef.current.caches.columnGrouping.lastColumnGroupingModel) {
        return;
      }
      apiRef.current.caches.columnGrouping.lastColumnGroupingModel = columnGroupingModel;
      // @ts-expect-error Move this logic to `Pro` package
      const pinnedColumns = apiRef.current.getPinnedColumns?.() ?? {};
      const columnFields = gridColumnFieldsSelector(apiRef);
      const visibleColumnFields = gridVisibleColumnFieldsSelector(apiRef);
      const groupLookup = createGroupLookup(columnGroupingModel ?? []);
      const unwrappedGroupingModel = unwrapGroupingColumnModel(columnGroupingModel ?? []);
      const columnGroupsHeaderStructure = getColumnGroupsHeaderStructure(
        columnFields,
        unwrappedGroupingModel,
        pinnedColumns,
      );
      const maxDepth =
        visibleColumnFields.length === 0
          ? 0
          : Math.max(
              ...visibleColumnFields.map((field) => unwrappedGroupingModel[field]?.length ?? 0),
            );

      apiRef.current.setState((state) => {
        return {
          ...state,
          columnGrouping: {
            lookup: groupLookup,
            unwrappedGroupingModel,
            headerStructure: columnGroupsHeaderStructure,
            maxDepth,
          },
        };
      });
    },
    [apiRef],
  );

  useGridEvent(apiRef, 'columnIndexChange', handleColumnIndexChange);
  useGridEvent(apiRef, 'columnsChange', () => {
    updateColumnGroupingState(props.columnGroupingModel);
  });
  useGridEvent(apiRef, 'columnVisibilityModelChange', () => {
    updateColumnGroupingState(props.columnGroupingModel);
  });

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (
      props.columnGroupingModel === apiRef.current.caches.columnGrouping.lastColumnGroupingModel
    ) {
      return;
    }
    updateColumnGroupingState(props.columnGroupingModel);
  }, [apiRef, updateColumnGroupingState, props.columnGroupingModel]);
};
