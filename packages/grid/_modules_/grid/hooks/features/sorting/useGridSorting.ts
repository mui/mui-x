import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSortApi } from '../../../models/api/gridSortApi';
import { GridCellValue } from '../../../models/gridCell';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
import { GridRowId, GridRowConfigTree } from '../../../models/gridRows';
import {
  GridFieldComparatorList,
  GridSortItem,
  GridSortModel,
  GridSortDirection,
  GridSortCellParams,
} from '../../../models/gridSortModel';
import { isDesc, nextGridSortDirection } from '../../../utils/sortingUtils';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../core/useGridState';
import {
  gridSortedRowIdsSelector,
  gridSortedRowIdsFlatSelector,
  gridSortedRowsSelector,
  gridSortModelSelector,
} from './gridSortingSelector';
import { gridRowExpandedTreeSelector } from '../rows';
import { GridSortedRowsIdTreeNode } from './gridSortingState';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';

/**
 * @requires useGridRows (state, event)
 * @requires useGridControlState (method)
 * @requires useGridColumns (event)
 */
export const useGridSorting = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'sortModel'
    | 'onSortModelChange'
    | 'sortingOrder'
    | 'sortingMode'
    | 'disableMultipleColumnsSorting'
    | 'disableChildrenSorting'
  >,
) => {
  const logger = useGridLogger(apiRef, 'useGridSorting');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    sorting: {
      sortModel: props.sortModel ?? [],
      sortedRows: [],
    },
  }));

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  apiRef.current.updateControlState({
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
            ? nextGridSortDirection(props.sortingOrder, existing.sort)
            : directionOverride;

        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return {
        field: col.field,
        sort:
          directionOverride === undefined
            ? nextGridSortDirection(props.sortingOrder)
            : directionOverride,
      };
    },
    [apiRef, props.sortingOrder],
  );

  const getSortCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const params: GridSortCellParams = {
        id,
        field,
        value: apiRef.current.getCellValue(id, field),
        api: apiRef.current,
      };

      return params;
    },
    [apiRef],
  );

  const comparatorListAggregate = React.useCallback(
    (comparatorList: GridFieldComparatorList) =>
      (row1: GridSortCellParams[], row2: GridSortCellParams[]) => {
        return comparatorList.reduce((res, colComparator, index) => {
          if (res !== 0) {
            return res;
          }

          const { comparator } = colComparator;
          const sortCellParams1 = row1[index];
          const sortCellParams2 = row2[index];
          res = comparator(
            sortCellParams1.value,
            sortCellParams2.value,
            sortCellParams1,
            sortCellParams2,
          );
          return res;
        }, 0);
      },
    [],
  );

  const buildComparatorList = React.useCallback(
    (sortModel: GridSortModel): GridFieldComparatorList => {
      const comparators = sortModel.map((item) => {
        const column = apiRef.current.getColumn(item.field);
        if (!column) {
          throw new Error(`Error sorting: column with field '${item.field}' not found. `);
        }
        const comparator = isDesc(item.sort)
          ? (
              v1: GridCellValue,
              v2: GridCellValue,
              cellParams1: GridSortCellParams,
              cellParams2: GridSortCellParams,
            ) => -1 * column.sortComparator!(v1, v2, cellParams1, cellParams2)
          : column.sortComparator!;
        return { field: column.field, comparator };
      });
      return comparators;
    },
    [apiRef],
  );

  const applySorting = React.useCallback<GridSortApi['applySorting']>(() => {
    const unsortedRowTree = gridRowExpandedTreeSelector(apiRef.current.state);
    const skipServerSorting = props.sortingMode === GridFeatureModeConstant.server;

    if (skipServerSorting) {
      logger.debug('Skipping sorting rows as sortingMode = server');
    }

    const sortModel = gridSortModelSelector(apiRef.current.state);
    const comparatorList = buildComparatorList(sortModel);
    const aggregatedComparator = comparatorListAggregate(comparatorList);

    const sortRowTree = (tree: GridRowConfigTree, depth = 0): GridSortedRowsIdTreeNode[] => {
      if (depth > 0 && props.disableChildrenSorting) {
        return Array.from(tree.values()).map((value) => ({
          id: value.id,
          children: value.children ? sortRowTree(value.children, depth + 1) : undefined,
        }));
      }

      const rowsWithParams = Array.from(tree.entries()).map(([name, value]) => {
        const params = comparatorList.map((colComparator) =>
          getSortCellParams(value.id, colComparator.field),
        );

        return { value, name, params };
      });

      const sortedRowsWithParams = skipServerSorting
        ? rowsWithParams
        : rowsWithParams.sort((a, b) => aggregatedComparator(a.params, b.params));

      return sortedRowsWithParams.map((node) => ({
        id: node.value.id,
        children: node.value.children ? sortRowTree(node.value.children, depth + 1) : undefined,
      }));
    };
    const sortedRows = sortRowTree(unsortedRowTree);

    setGridState((state) => ({
      ...state,
      sorting: { ...state.sorting, sortedRows },
    }));
    forceUpdate();
  }, [
    apiRef,
    logger,
    getSortCellParams,
    setGridState,
    forceUpdate,
    buildComparatorList,
    comparatorListAggregate,
    props.sortingMode,
    props.disableChildrenSorting,
  ]);

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

  const getSortedRows = React.useCallback<GridSortApi['getSortedRows']>(
    () => gridSortedRowsSelector(apiRef.current.state),
    [apiRef],
  );

  const getSortedRowIds = React.useCallback<GridSortApi['getSortedRowIds']>(
    () => gridSortedRowIdsSelector(apiRef.current.state),
    [apiRef],
  );

  const getFlatSortedRowIds = React.useCallback<GridSortApi['getFlatSortedRowIds']>(
    () => gridSortedRowIdsFlatSelector(apiRef.current.state),
    [apiRef],
  );

  const sortApi: GridSortApi = {
    getSortModel,
    getSortedRows,
    getSortedRowIds,
    getFlatSortedRowIds,
    setSortModel,
    sortColumn,
    applySorting,
  };
  useGridApiMethod(apiRef, sortApi, 'GridSortApi');

  React.useEffect(() => {
    if (props.sortModel !== undefined) {
      apiRef.current.setSortModel(props.sortModel);
    }
  }, [apiRef, props.sortModel]);

  // The filter options have changed
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    apiRef.current.applySorting();
  }, [apiRef, props.disableChildrenSorting]);

  useFirstRender(() => apiRef.current.applySorting());

  const handleColumnHeaderClick = React.useCallback(
    ({ colDef }: GridColumnHeaderParams, event: React.MouseEvent) => {
      const allowMultipleSorting = event.shiftKey || event.metaKey || event.ctrlKey;
      sortColumn(colDef, undefined, allowMultipleSorting);
    },
    [sortColumn],
  );

  const handleColumnHeaderKeyDown = React.useCallback(
    ({ colDef }: GridColumnHeaderParams, event: React.KeyboardEvent) => {
      // CTRL + Enter opens the column menu
      if (isEnterKey(event.key) && !event.ctrlKey && !event.metaKey) {
        sortColumn(colDef, undefined, event.shiftKey);
      }
    },
    [sortColumn],
  );

  const onColUpdated = React.useCallback(() => {
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

  useGridApiEventHandler(apiRef, GridEvents.columnHeaderClick, handleColumnHeaderClick);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, onColUpdated);
};
