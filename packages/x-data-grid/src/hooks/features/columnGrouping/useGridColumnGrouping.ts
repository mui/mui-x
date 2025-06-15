import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  GridColumnGroupingModel,
  GridColumnNode,
  isLeaf,
} from '../../../models/gridColumnGrouping';
import {
  gridColumnGroupsLookupSelector,
  gridColumnGroupsUnwrappedModelSelector,
} from './gridColumnGroupsSelector';
import { GridColumnGroupLookup } from './gridColumnGroupsInterfaces';
import { GridColumnGroupingApi } from '../../../models/api/gridColumnGroupingApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { getColumnGroupsHeaderStructure, unwrapGroupingColumnModel } from './gridColumnGroupsUtils';
import { useGridEvent } from '../../utils/useGridEvent';
import { GridEventListener } from '../../../models/events';
import { gridColumnFieldsSelector, gridVisibleColumnFieldsSelector } from '../columns';

const createGroupLookup = (columnGroupingModel: GridColumnNode[]): GridColumnGroupLookup => {
  const groupLookup: GridColumnGroupLookup = {};

  for (let i = 0; i < columnGroupingModel.length; i += 1) {
    const node = columnGroupingModel[i];

    if (isLeaf(node)) {
      continue;
    }

    const { groupId, children, ...other } = node;

    if (!groupId) {
      throw new Error(
        'MUI X: An element of the columnGroupingModel does not have either `field` or `groupId`.',
      );
    }

    if (process.env.NODE_ENV !== 'production' && !children) {
      console.warn(`MUI X: group groupId=${groupId} has no children.`);
    }

    const groupParam = { ...other, groupId };
    const subTreeLookup = createGroupLookup(children);

    if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
      throw new Error(
        `MUI X: The groupId ${groupId} is used multiple times in the columnGroupingModel.`,
      );
    }

    Object.assign(groupLookup, subTreeLookup);
    groupLookup[groupId] = groupParam;
  }

  return groupLookup;
};

export const columnGroupsStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'columnGroupingModel'>
> = (state, props, apiRef) => {
  apiRef.current.caches.columnGrouping = {};
  if (!props.columnGroupingModel) {
    return state;
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
