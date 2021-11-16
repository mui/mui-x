import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSortApi } from '../../../models/api/gridSortApi';
import { GridCellValue } from '../../../models/gridCell';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridRowId, GridRowTreeNodeConfig } from '../../../models/gridRows';
import {
  GridFieldComparatorList,
  GridSortItem,
  GridSortModel,
  GridSortDirection,
  GridSortCellParams,
} from '../../../models/gridSortModel';
import { isDesc, nextGridSortDirection } from '../../../utils/sortingUtils';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useGridState } from '../../utils/useGridState';
import {
  gridSortModelSelector,
  gridSortedRowIdsSelector,
  gridSortedRowEntriesSelector,
} from './gridSortingSelector';
import { gridRowIdsSelector, gridRowTreeDepthSelector, gridRowTreeSelector } from '../rows';
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
    | 'initialState'
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
    if (props.sortingMode === GridFeatureModeConstant.server) {
      logger.debug('Skipping sorting rows as sortingMode = server');
      setGridState((state) => ({
        ...state,
        sorting: { ...state.sorting, sortedRows: gridRowIdsSelector(state) },
      }));
      return;
    }

    setGridState((state) => {
      const rowIds = gridRowIdsSelector(state);
      const rowTree = gridRowTreeSelector(state);
      const shouldApplyTreeSorting = gridRowTreeDepthSelector(state) > 1;
      const sortModel = gridSortModelSelector(state);
      const comparatorList = buildComparatorList(sortModel);
      const aggregatedComparator = comparatorListAggregate(comparatorList);

      const sortRowList = (rowList: GridRowTreeNodeConfig[]) =>
        rowList
          .map((value) => ({
            value,
            params: comparatorList.map((colComparator) =>
              getSortCellParams(value.id, colComparator.field),
            ),
          }))
          .sort((a, b) => aggregatedComparator(a.params, b.params))
          .map((row) => row.value.id);

      let sortedRows: GridRowId[] = [];
      if (shouldApplyTreeSorting) {
        // Group the rows by parent
        const groupedByParentRows = new Map<GridRowId | null, GridRowTreeNodeConfig[]>([
          [null, []],
        ]);
        for (let i = 0; i < rowIds.length; i += 1) {
          const rowId = rowIds[i];
          const node = rowTree[rowId];
          let group = groupedByParentRows.get(node.parent);
          if (!group) {
            group = [];
            groupedByParentRows.set(node.parent, group);
          }
          group.push(node);
        }

        // Apply the sorting to each list of children
        const sortedGroupedByParentRows = new Map<GridRowId | null, GridRowId[]>();
        groupedByParentRows.forEach((rowList, parent) => {
          if (rowList.length === 0) {
            sortedGroupedByParentRows.set(parent, []);
          } else {
            const depth = rowList[0].depth;
            if (depth > 0 && props.disableChildrenSorting) {
              sortedGroupedByParentRows.set(
                parent,
                rowList.map((row) => row.id),
              );
            } else if (comparatorList.length === 0) {
              sortedGroupedByParentRows.set(
                parent,
                rowList.map((row) => row.id),
              );
            } else {
              sortedGroupedByParentRows.set(parent, sortRowList(rowList));
            }
          }
        });

        // Flatten the sorted lists to have children just after their parent
        const insertRowListIntoSortedRows = (startIndex: number, rowList: GridRowId[]) => {
          sortedRows = [
            ...sortedRows.slice(0, startIndex),
            ...rowList,
            ...sortedRows.slice(startIndex),
          ];

          let treeSize = 0;
          rowList.forEach((rowId) => {
            treeSize += 1;
            const children = sortedGroupedByParentRows.get(rowId);
            if (children?.length) {
              const subTreeSize = insertRowListIntoSortedRows(startIndex + treeSize, children);
              treeSize += subTreeSize;
            }
          });

          return treeSize;
        };

        insertRowListIntoSortedRows(0, sortedGroupedByParentRows.get(null)!);
      } else if (comparatorList.length === 0) {
        sortedRows = rowIds;
      } else {
        sortedRows = sortRowList(Object.values(rowTree));
      }

      return {
        ...state,
        sorting: { ...state.sorting, sortedRows },
      };
    });
    forceUpdate();
  }, [
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

  React.useEffect(() => {
    if (props.sortModel !== undefined) {
      apiRef.current.setSortModel(props.sortModel);
    }
  }, [apiRef, props.sortModel]);

  // The sorting options have changed
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    apiRef.current.applySorting();
  }, [apiRef, props.disableChildrenSorting]);

  useFirstRender(() => apiRef.current.applySorting());

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

  useGridApiEventHandler(apiRef, GridEvents.columnHeaderClick, handleColumnHeaderClick);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, handleColumnsChange);
};
