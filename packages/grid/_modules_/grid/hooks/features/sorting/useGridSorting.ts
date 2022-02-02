import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSortApi } from '../../../models/api/gridSortApi';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridSortItem, GridSortModel, GridSortDirection } from '../../../models/gridSortModel';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import {
  gridSortedRowEntriesSelector,
  gridSortedRowIdsSelector,
  gridSortModelSelector,
} from './gridSortingSelector';
import { gridRowIdsSelector, gridRowGroupingNameSelector, gridRowTreeSelector } from '../rows';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridSortingMethod, GridSortingMethodCollection } from './gridSortingState';
import {
  buildAggregatedSortingApplier,
  mergeStateWithSortModel,
  getNextGridSortDirection,
} from './gridSortingUtils';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { useGridRegisterSortingMethod } from './useGridRegisterSortingMethod';

/**
 * @requires useGridRows (state, event)
 * @requires useGridColumns (event)
 */
export const useGridSorting = (
  apiRef: GridApiRef,
  props: Pick<
    DataGridProcessedProps,
    | 'initialState'
    | 'sortModel'
    | 'onSortModelChange'
    | 'sortingOrder'
    | 'sortingMode'
    | 'disableMultipleColumnsSorting'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridSorting');
  const sortingMethodCollectionRef = React.useRef<GridSortingMethodCollection>({});
  const lastSortingMethodApplied = React.useRef<GridSortingMethod | null>(null);

  useGridStateInit(apiRef, (state) => ({
    ...state,
    sorting: {
      sortModel: props.sortModel ?? props.initialState?.sorting?.sortModel ?? [],
      sortedRows: [],
    },
  }));

  apiRef.current.unstable_updateControlState({
    stateId: 'sortModel',
    propModel: props.sortModel,
    propOnChange: props.onSortModelChange,
    stateSelector: gridSortModelSelector,
    changeEvent: GridEvents.sortModelChange,
  });

  const upsertSortModel = React.useCallback(
    (field: string, sortItem?: GridSortItem): GridSortModel => {
      const sortModel = gridSortModelSelector(apiRef);
      const existingIdx = sortModel.findIndex((c) => c.field === field);
      let newSortModel = [...sortModel];
      if (existingIdx > -1) {
        if (!sortItem) {
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
            ? getNextGridSortDirection(col.sortingOrder ?? props.sortingOrder, existing.sort)
            : directionOverride;

        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return {
        field: col.field,
        sort:
          directionOverride === undefined
            ? getNextGridSortDirection(col.sortingOrder ?? props.sortingOrder)
            : directionOverride,
      };
    },
    [apiRef, props.sortingOrder],
  );

  /**
   * API METHODS
   */
  const applySorting = React.useCallback<GridSortApi['applySorting']>(() => {
    if (props.sortingMode === GridFeatureModeConstant.server) {
      logger.debug('Skipping sorting rows as sortingMode = server');
      apiRef.current.setState((state) => ({
        ...state,
        sorting: {
          ...state.sorting,
          sortedRows: gridRowIdsSelector(state, apiRef.current.instanceId),
        },
      }));
      return;
    }

    apiRef.current.setState((state) => {
      const rowGroupingName = gridRowGroupingNameSelector(state, apiRef.current.instanceId);
      const sortingMethod = sortingMethodCollectionRef.current[rowGroupingName];
      if (!sortingMethod) {
        throw new Error('MUI: Invalid sorting method.');
      }

      const sortModel = gridSortModelSelector(state, apiRef.current.instanceId);
      const sortRowList = buildAggregatedSortingApplier(sortModel, apiRef);

      const sortedRows = sortingMethod({
        sortRowList,
      });

      return {
        ...state,
        sorting: { ...state.sorting, sortedRows },
      };
    });
    apiRef.current.forceUpdate();
  }, [apiRef, logger, props.sortingMode]);

  const setSortModel = React.useCallback<GridSortApi['setSortModel']>(
    (model) => {
      const currentModel = gridSortModelSelector(apiRef);
      if (currentModel !== model) {
        logger.debug(`Setting sort model`);
        apiRef.current.setState(mergeStateWithSortModel(model));
        apiRef.current.forceUpdate();
        apiRef.current.applySorting();
      }
    },
    [apiRef, logger],
  );

  const sortColumn = React.useCallback<GridSortApi['sortColumn']>(
    (column, direction, allowMultipleSorting) => {
      if (!column.sortable) {
        return;
      }
      const sortItem = createSortItem(column, direction);
      let sortModel: GridSortItem[];
      if (!allowMultipleSorting || props.disableMultipleColumnsSorting) {
        sortModel = !sortItem ? [] : [sortItem];
      } else {
        sortModel = upsertSortModel(column.field, sortItem);
      }
      apiRef.current.setSortModel(sortModel);
    },
    [apiRef, upsertSortModel, createSortItem, props.disableMultipleColumnsSorting],
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

  const getRowIndex = React.useCallback<GridSortApi['getRowIndex']>(
    (id) => apiRef.current.getSortedRowIds().indexOf(id),
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
    getRowIndex,
    getRowIdFromRowIndex,
    setSortModel,
    sortColumn,
    applySorting,
  };
  useGridApiMethod(apiRef, sortApi, 'GridSortApi');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPreProcessor<'exportState'>>(
    (prevState) => {
      const sortModelToExport = gridSortModelSelector(apiRef);
      if (sortModelToExport.length === 0) {
        return prevState;
      }

      return {
        ...prevState,
        sorting: {
          sortModel: sortModelToExport,
        },
      };
    },
    [apiRef],
  );

  const stateRestorePreProcessing = React.useCallback<GridPreProcessor<'restoreState'>>(
    (params, context) => {
      const sortModel = context.stateToRestore.sorting?.sortModel;
      if (sortModel == null) {
        return params;
      }
      apiRef.current.setState(mergeStateWithSortModel(sortModel));

      return {
        ...params,
        callbacks: [...params.callbacks, apiRef.current.applySorting],
      };
    },
    [apiRef],
  );

  const flatSortingMethod = React.useCallback<GridSortingMethod>(
    (params) => {
      if (!params.sortRowList) {
        return gridRowIdsSelector(apiRef);
      }

      const rowTree = gridRowTreeSelector(apiRef);
      return params.sortRowList(Object.values(rowTree));
    },
    [apiRef],
  );

  useGridRegisterPreProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPreProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterSortingMethod(apiRef, 'none', flatSortingMethod);

  /**
   * EVENTS
   */
  const handleColumnHeaderClick = React.useCallback<
    GridEventListener<GridEvents.columnHeaderClick>
  >(
    ({ colDef }, event) => {
      const allowMultipleSorting = event.shiftKey || event.metaKey || event.ctrlKey;
      sortColumn(colDef, undefined, allowMultipleSorting);
    },
    [sortColumn],
  );

  const handleColumnHeaderKeyDown = React.useCallback<
    GridEventListener<GridEvents.columnHeaderKeyDown>
  >(
    ({ colDef }, event) => {
      // CTRL + Enter opens the column menu
      if (isEnterKey(event.key) && !event.ctrlKey && !event.metaKey) {
        sortColumn(colDef, undefined, event.shiftKey);
      }
    },
    [sortColumn],
  );

  const handleColumnsChange = React.useCallback<GridEventListener<GridEvents.columnsChange>>(() => {
    // When the columns change we check that the sorted columns are still part of the dataset
    const sortModel = gridSortModelSelector(apiRef);
    const latestColumns = allGridColumnsSelector(apiRef);

    if (sortModel.length > 0) {
      const newModel = sortModel.filter((sortItem) =>
        latestColumns.find((col) => col.field === sortItem.field),
      );

      if (newModel.length < sortModel.length) {
        apiRef.current.setSortModel(newModel);
      }
    }
  }, [apiRef]);

  const handlePreProcessorRegister = React.useCallback<
    GridEventListener<GridEvents.preProcessorRegister>
  >(
    (name) => {
      if (name !== 'sortingMethod') {
        return;
      }

      sortingMethodCollectionRef.current = apiRef.current.unstable_applyPreProcessors(
        'sortingMethod',
        {},
      );

      const rowGroupingName = gridRowGroupingNameSelector(apiRef);
      if (
        lastSortingMethodApplied.current !== sortingMethodCollectionRef.current[rowGroupingName]
      ) {
        apiRef.current.applySorting();
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.columnHeaderClick, handleColumnHeaderClick);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, handleColumnsChange);
  useGridApiEventHandler(apiRef, GridEvents.preProcessorRegister, handlePreProcessorRegister);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    // This line of pre-processor initialization should always come after the registration of `flatSortingMethod`
    // Otherwise on the 1st render there would be no sorting method registered
    sortingMethodCollectionRef.current = apiRef.current.unstable_applyPreProcessors(
      'sortingMethod',
      {},
    );
    apiRef.current.applySorting();
  });

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.sortModel !== undefined) {
      apiRef.current.setSortModel(props.sortModel);
    }
  }, [apiRef, props.sortModel]);
};
