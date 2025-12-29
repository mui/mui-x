import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { GridEventListener } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridSortApi } from '../../../models/api/gridSortApi';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridGroupNode } from '../../../models/gridRows';
import { GridSortItem, GridSortModel, GridSortDirection } from '../../../models/gridSortModel';
import { useGridEvent } from '../../utils/useGridEvent';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridColumnLookupSelector } from '../columns/gridColumnsSelector';
import {
  gridSortedRowEntriesSelector,
  gridSortedRowIdsSelector,
  gridSortModelSelector,
} from './gridSortingSelector';
import { GRID_ROOT_GROUP_ID, gridRowTreeSelector } from '../rows';
import { useFirstRender } from '../../utils/useFirstRender';
import {
  useGridRegisterStrategyProcessor,
  GridStrategyProcessor,
  GRID_DEFAULT_STRATEGY,
} from '../../core/strategyProcessing';
import {
  buildAggregatedSortingApplier,
  mergeStateWithSortModel,
  getNextGridSortDirection,
  sanitizeSortModel,
} from './gridSortingUtils';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '../../core/pipeProcessing';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { getTreeNodeDescendants } from '../rows/gridRowsUtils';

export const sortingStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'sortModel' | 'initialState' | 'disableMultipleColumnsSorting'>
> = (state, props) => {
  const { sortModel: sortModelProp, initialState, disableMultipleColumnsSorting } = props;
  const sortModel = sortModelProp ?? initialState?.sorting?.sortModel ?? [];

  return {
    ...state,
    sorting: {
      sortModel: sanitizeSortModel(sortModel, disableMultipleColumnsSorting),
      sortedRows: [],
    },
  };
};

/**
 * @requires useGridRows (event)
 * @requires useGridColumns (event)
 */
export const useGridSorting = (
  apiRef: RefObject<GridPrivateApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'initialState'
    | 'sortModel'
    | 'onSortModelChange'
    | 'sortingOrder'
    | 'sortingMode'
    | 'disableColumnSorting'
    | 'disableMultipleColumnsSorting'
    | 'multipleColumnsSortingMode'
    | 'signature'
  >,
) => {
  const {
    initialState,
    sortModel: sortModelProp,
    onSortModelChange,
    sortingOrder: sortingOrderProp,
    sortingMode,
    disableColumnSorting,
    disableMultipleColumnsSorting,
    multipleColumnsSortingMode,
    signature,
  } = props;
  const logger = useGridLogger(apiRef, 'useGridSorting');

  apiRef.current.registerControlState({
    stateId: 'sortModel',
    propModel: sortModelProp,
    propOnChange: onSortModelChange,
    stateSelector: gridSortModelSelector,
    changeEvent: 'sortModelChange',
  });

  const upsertSortModel = React.useCallback(
    (field: string, sortItem?: GridSortItem): GridSortModel => {
      const sortModel = gridSortModelSelector(apiRef);
      const existingIdx = sortModel.findIndex((c) => c.field === field);
      let newSortModel = [...sortModel];
      if (existingIdx > -1) {
        if (sortItem?.sort == null) {
          newSortModel.splice(existingIdx, 1);
        } else {
          newSortModel.splice(existingIdx, 1, sortItem);
        }
      } else {
        newSortModel = [...sortModel, sortItem!];
      }
      return newSortModel;
    },
    [apiRef],
  );

  const createSortItem = React.useCallback(
    (col: GridColDef, directionOverride?: GridSortDirection): GridSortItem | undefined => {
      const sortModel = gridSortModelSelector(apiRef);
      const existing = sortModel.find((c) => c.field === col.field);

      if (existing) {
        const nextSort =
          directionOverride === undefined
            ? getNextGridSortDirection(col.sortingOrder ?? sortingOrderProp, existing.sort)
            : directionOverride;

        return nextSort === undefined ? undefined : { ...existing, sort: nextSort };
      }
      return {
        field: col.field,
        sort:
          directionOverride === undefined
            ? getNextGridSortDirection(col.sortingOrder ?? sortingOrderProp)
            : directionOverride,
      };
    },
    [apiRef, sortingOrderProp],
  );

  const addColumnMenuItem = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems, colDef) => {
      if (colDef == null || colDef.sortable === false || disableColumnSorting) {
        return columnMenuItems;
      }

      const sortingOrder = colDef.sortingOrder || sortingOrderProp;

      if (sortingOrder.some((item) => !!item)) {
        return [...columnMenuItems, 'columnMenuSortItem'];
      }

      return columnMenuItems;
    },
    [sortingOrderProp, disableColumnSorting],
  );

  /**
   * API METHODS
   */
  const applySorting = React.useCallback<GridSortApi['applySorting']>(() => {
    apiRef.current.setState((state) => {
      if (sortingMode === 'server') {
        logger.debug('Skipping sorting rows as sortingMode = server');
        return {
          ...state,
          sorting: {
            ...state.sorting,
            sortedRows: getTreeNodeDescendants(
              gridRowTreeSelector(apiRef),
              GRID_ROOT_GROUP_ID,
              false,
            ),
          },
        };
      }

      const sortModel = gridSortModelSelector(apiRef);
      const sortRowList = buildAggregatedSortingApplier(sortModel, apiRef);
      const sortedRows = apiRef.current.applyStrategyProcessor('sorting', {
        sortRowList,
      });

      return {
        ...state,
        sorting: { ...state.sorting, sortedRows },
      };
    });

    apiRef.current.publishEvent('sortedRowsSet');
  }, [apiRef, logger, sortingMode]);

  const setSortModel = React.useCallback<GridSortApi['setSortModel']>(
    (model) => {
      const currentModel = gridSortModelSelector(apiRef);
      if (currentModel !== model) {
        logger.debug(`Setting sort model`);
        apiRef.current.setState(mergeStateWithSortModel(model, disableMultipleColumnsSorting));
        apiRef.current.applySorting();
      }
    },
    [apiRef, logger, disableMultipleColumnsSorting],
  );

  const sortColumn = React.useCallback<GridSortApi['sortColumn']>(
    (field, direction, allowMultipleSorting) => {
      const column = apiRef.current.getColumn(field);
      const sortItem = createSortItem(column, direction);
      let sortModel: GridSortModel;
      if (!allowMultipleSorting || disableMultipleColumnsSorting) {
        sortModel = sortItem?.sort == null ? [] : [sortItem];
      } else {
        sortModel = upsertSortModel(column.field, sortItem);
      }
      apiRef.current.setSortModel(sortModel);
    },
    [apiRef, upsertSortModel, createSortItem, disableMultipleColumnsSorting],
  );

  const getSortModel = React.useCallback<GridSortApi['getSortModel']>(
    () => gridSortModelSelector(apiRef),
    [apiRef],
  );

  const getSortedRows = React.useCallback<GridSortApi['getSortedRows']>(() => {
    const sortedRows = gridSortedRowEntriesSelector(apiRef);
    return sortedRows.map((row) => row.model);
  }, [apiRef]);

  const getSortedRowIds = React.useCallback<GridSortApi['getSortedRowIds']>(
    () => gridSortedRowIdsSelector(apiRef),
    [apiRef],
  );

  const getRowIdFromRowIndex = React.useCallback<GridSortApi['getRowIdFromRowIndex']>(
    (index) => apiRef.current.getSortedRowIds()[index],
    [apiRef],
  );

  const sortApi: GridSortApi = {
    getSortModel,
    getSortedRows,
    getSortedRowIds,
    getRowIdFromRowIndex,
    setSortModel,
    sortColumn,
    applySorting,
  };
  useGridApiMethod(apiRef, sortApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const sortModelToExport = gridSortModelSelector(apiRef);

      const shouldExportSortModel =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the model is controlled
        sortModelProp != null ||
        // Always export if the model has been initialized
        initialState?.sorting?.sortModel != null ||
        // Export if the model is not empty
        sortModelToExport.length > 0;

      if (!shouldExportSortModel) {
        return prevState;
      }

      return {
        ...prevState,
        sorting: {
          sortModel: sortModelToExport,
        },
      };
    },
    [apiRef, sortModelProp, initialState?.sorting?.sortModel],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const sortModel = context.stateToRestore.sorting?.sortModel;
      if (sortModel == null) {
        return params;
      }
      apiRef.current.setState(mergeStateWithSortModel(sortModel, disableMultipleColumnsSorting));

      return {
        ...params,
        callbacks: [...params.callbacks, apiRef.current.applySorting],
      };
    },
    [apiRef, disableMultipleColumnsSorting],
  );

  const flatSortingMethod = React.useCallback<GridStrategyProcessor<'sorting'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);
      const rootGroupNode = rowTree[GRID_ROOT_GROUP_ID] as GridGroupNode;

      const sortedChildren = params.sortRowList
        ? params.sortRowList(rootGroupNode.children.map((childId) => rowTree[childId]))
        : [...rootGroupNode.children];
      if (rootGroupNode.footerId != null) {
        sortedChildren.push(rootGroupNode.footerId);
      }

      return sortedChildren;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterStrategyProcessor(apiRef, GRID_DEFAULT_STRATEGY, 'sorting', flatSortingMethod);

  /**
   * EVENTS
   */
  const handleColumnHeaderClick = React.useCallback<GridEventListener<'columnHeaderClick'>>(
    ({ field, colDef }, event) => {
      if (!colDef.sortable || disableColumnSorting) {
        return;
      }
      const allowMultipleSorting =
        multipleColumnsSortingMode === 'always' || event.shiftKey || event.metaKey || event.ctrlKey;
      sortColumn(field, undefined, allowMultipleSorting);
    },
    [sortColumn, disableColumnSorting, multipleColumnsSortingMode],
  );

  const handleColumnHeaderKeyDown = React.useCallback<GridEventListener<'columnHeaderKeyDown'>>(
    ({ field, colDef }, event) => {
      if (!colDef.sortable || disableColumnSorting) {
        return;
      }
      // Ctrl + Enter opens the column menu
      if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
        sortColumn(field, undefined, multipleColumnsSortingMode === 'always' || event.shiftKey);
      }
    },
    [sortColumn, disableColumnSorting, multipleColumnsSortingMode],
  );

  const handleColumnsChange = React.useCallback<GridEventListener<'columnsChange'>>(() => {
    // When the columns change we check that the sorted columns are still part of the dataset
    const sortModel = gridSortModelSelector(apiRef);
    const latestColumns = gridColumnLookupSelector(apiRef);

    if (sortModel.length > 0) {
      const newModel = sortModel.filter((sortItem) => latestColumns[sortItem.field]);

      if (newModel.length < sortModel.length) {
        apiRef.current.setSortModel(newModel);
      }
    }
  }, [apiRef]);

  const handleStrategyProcessorChange = React.useCallback<
    GridEventListener<'activeStrategyProcessorChange'>
  >(
    (methodName) => {
      if (methodName === 'sorting') {
        apiRef.current.applySorting();
      }
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuItem);

  useGridEvent(apiRef, 'columnHeaderClick', handleColumnHeaderClick);
  useGridEvent(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
  useGridEvent(apiRef, 'rowsSet', apiRef.current.applySorting);
  useGridEvent(apiRef, 'columnsChange', handleColumnsChange);
  useGridEvent(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    if (signature === 'DataGrid') {
      apiRef.current.applySorting();
    }
  });

  /**
   * EFFECTS
   */
  useEnhancedEffect(() => {
    if (sortModelProp !== undefined) {
      apiRef.current.setSortModel(sortModelProp);
    }
  }, [apiRef, sortModelProp]);
};
