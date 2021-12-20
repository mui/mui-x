import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSortApi } from '../../../models/api/gridSortApi';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridSortItem, GridSortModel, GridSortDirection } from '../../../models/gridSortModel';
import { nextGridSortDirection } from '../../../utils/sortingUtils';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../../utils/useGridState';
import {
  gridSortedRowEntriesSelector,
  gridSortedRowIdsSelector,
  gridSortModelSelector,
} from './gridSortingSelector';
import { gridRowIdsSelector, gridRowGroupingNameSelector, gridRowTreeSelector } from '../rows';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridSortingMethod, GridSortingMethodCollection } from './gridSortingState';
import { buildAggregatedSortingApplier } from './gridSortingUtils';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { useGridRegisterSortingMethod } from './useGridRegisterSortingMethod';

/**
 * @requires useGridRows (state, event)
 * @requires useGridColumns (event)
 */
export const useGridSorting = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
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

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.unstable_updateControlState({
    stateId: 'sortModel',
    propModel: props.sortModel,
    propOnChange: props.onSortModelChange,
    stateSelector: gridSortModelSelector,
    changeEvent: GridEvents.sortModelChange,
  });

  const upsertSortModel = React.useCallback(
    (field: string, sortItem?: GridSortItem): GridSortModel => {
      const sortModel = gridSortModelSelector(apiRef.current.state);
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
      const sortModel = gridSortModelSelector(apiRef.current.state);
      const existing = sortModel.find((c) => c.field === col.field);

      if (existing) {
        const nextSort =
          directionOverride === undefined
            ? nextGridSortDirection(col.sortingOrder ?? props.sortingOrder, existing.sort)
            : directionOverride;

        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return {
        field: col.field,
        sort:
          directionOverride === undefined
            ? nextGridSortDirection(col.sortingOrder ?? props.sortingOrder)
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
      setGridState((state) => ({
        ...state,
        sorting: { ...state.sorting, sortedRows: gridRowIdsSelector(state) },
      }));
      return;
    }

    setGridState((state) => {
      const rowGroupingName = gridRowGroupingNameSelector(state);
      const sortingMethod = sortingMethodCollectionRef.current[rowGroupingName];
      if (!sortingMethod) {
        throw new Error('MUI: Invalid sorting method.');
      }

      const sortModel = gridSortModelSelector(state);
      const sortRowList = buildAggregatedSortingApplier(sortModel, apiRef);

      const sortedRows = sortingMethod({
        sortRowList,
      });

      return {
        ...state,
        sorting: { ...state.sorting, sortedRows },
      };
    });
    forceUpdate();
  }, [apiRef, logger, setGridState, forceUpdate, props.sortingMode]);

  const setSortModel = React.useCallback<GridSortApi['setSortModel']>(
    (model) => {
      const currentModel = gridSortModelSelector(apiRef.current.state);
      if (currentModel !== model) {
        logger.debug(`Setting sort model`);
        setGridState((state) => ({ ...state, sorting: { ...state.sorting, sortModel: model } }));
        forceUpdate();
        apiRef.current.applySorting();
      }
    },
    [apiRef, setGridState, forceUpdate, logger],
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
    () => gridSortModelSelector(apiRef.current.state),
    [apiRef],
  );

  const getSortedRows = React.useCallback<GridSortApi['getSortedRows']>(() => {
    const sortedRows = gridSortedRowEntriesSelector(apiRef.current.state);
    return sortedRows.map((row) => row.model);
  }, [apiRef]);

  const getSortedRowIds = React.useCallback<GridSortApi['getSortedRowIds']>(
    () => gridSortedRowIdsSelector(apiRef.current.state),
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
  const flatSortingMethod = React.useCallback<GridSortingMethod>(
    (params) => {
      if (!params.sortRowList) {
        return gridRowIdsSelector(apiRef.current.state);
      }

      const rowTree = gridRowTreeSelector(apiRef.current.state);
      return params.sortRowList(Object.values(rowTree));
    },
    [apiRef],
  );

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
    const sortModel = gridSortModelSelector(apiRef.current.state);
    const latestColumns = allGridColumnsSelector(apiRef.current.state);

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
      if (name !== GridPreProcessingGroup.sortingMethod) {
        return;
      }

      sortingMethodCollectionRef.current = apiRef.current.unstable_applyPreProcessors(
        GridPreProcessingGroup.sortingMethod,
        {},
      );

      const rowGroupingName = gridRowGroupingNameSelector(apiRef.current.state);
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
      GridPreProcessingGroup.sortingMethod,
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
