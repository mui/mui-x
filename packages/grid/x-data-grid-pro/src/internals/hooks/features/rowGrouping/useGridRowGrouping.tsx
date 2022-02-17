import * as React from 'react';
import Divider from '@mui/material/Divider';
import {
  GridRowModel,
  GridRowId,
  GridColDef,
  GridKeyValue,
  GridColumnLookup,
  GridStateColDef,
  GridEvents,
  GridEventListener,
  gridRowIdsSelector,
  gridRowTreeSelector,
  useGridApiEventHandler,
  useGridApiMethod,
  gridColumnLookupSelector,
  gridFilteredDescendantCountLookupSelector,
  useFirstRender,
  unstable_useGridRegisterFilteringMethod as useGridRegisterFilteringMethod,
  unstable_useGridRegisterSortingMethod as useGridRegisterSortingMethod,
  unstable_useGridRegisterPreProcessor as useGridRegisterPreProcessor,
  unstable_useGridStateInit as useGridStateInit,
  unstable_isDeepEqual as isDeepEqual,
  Unstable_GridFilteringMethod as GridFilteringMethod,
  Unstable_GridSortingMethod as GridSortingMethod,
  Unstable_GridPreProcessor as GridPreProcessor,
  Unstable_GridColumnRawLookup as GridColumnRawLookup,
  Unstable_GridColumnsRawState as GridColumnsRawState,
  Unstable_GridRestoreStatePreProcessingContext as GridRestoreStatePreProcessingContext,
  Unstable_GridRowGroupingPreProcessing as GridRowGroupingPreProcessing,
} from '@mui/x-data-grid';
import { GridGroupingValueGetterParams } from '../../../models';
import { GridApiPro } from '../../../models/gridApiPro';
import { buildRowTree, BuildRowTreeGroupingCriteria } from '../../../utils/tree/buildRowTree';
import {
  gridRowGroupingModelSelector,
  gridRowGroupingSanitizedModelSelector,
} from './gridRowGroupingSelector';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  filterRowTreeFromGroupingColumns,
  getRowGroupingFieldFromGroupingCriteria,
  getColDefOverrides,
  GROUPING_COLUMNS_FEATURE_NAME,
  isGroupingColumn,
  mergeStateWithRowGroupingModel,
} from './gridRowGroupingUtils';
import {
  createGroupingColDefForOneGroupingCriteria,
  createGroupingColDefForAllGroupingCriteria,
} from './createGroupingColDef';
import { sortRowTree } from '../../../utils/tree/sortRowTree';
import { GridRowGroupingApi, GridRowGroupingModel } from './gridRowGroupingInterfaces';
import { GridRowGroupableColumnMenuItems } from '../../../components/GridRowGroupableColumnMenuItems';
import { GridRowGroupingColumnMenuItems } from '../../../components/GridRowGroupingColumnMenuItems';
import { GridInitialStatePro } from '../../../models/gridStatePro';

/**
 * Only available in DataGridPro
 * @requires useGridColumns (state, method) - can be after, async only
 * @requires useGridRows (state, method) - can be after, async only
 * @requires useGridParamsApi (method) - can be after, async only
 * TODO: Move the the Premium plan once available and remove the `experimentalFeatures.rowGrouping` flag
 */
export const useGridRowGrouping = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'initialState'
    | 'rowGroupingModel'
    | 'onRowGroupingModelChange'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'groupingColDef'
    | 'rowGroupingColumnMode'
    | 'disableRowGrouping'
  >,
) => {
  useGridStateInit(apiRef, (state) => ({
    ...state,
    rowGrouping: {
      model: props.rowGroupingModel ?? props.initialState?.rowGrouping?.model ?? [],
    },
  }));

  apiRef.current.unstable_updateControlState({
    stateId: 'rowGrouping',
    propModel: props.rowGroupingModel,
    propOnChange: props.onRowGroupingModelChange,
    stateSelector: gridRowGroupingModelSelector,
    changeEvent: GridEvents.rowGroupingModelChange,
  });

  /**
   * ROW GROUPING
   */
  // Tracks the model on the last pre-processing to check if we need to re-build the grouping columns when the grid upserts a column.
  const sanitizedModelOnLastRowPreProcessing = React.useRef<GridRowGroupingModel>([]);

  const updateRowGrouping = React.useCallback(() => {
    const groupRows: GridRowGroupingPreProcessing = (params) => {
      const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const columnsLookup = gridColumnLookupSelector(
        apiRef.current.state,
      ) as any as GridColumnLookup<GridApiPro>;
      sanitizedModelOnLastRowPreProcessing.current = rowGroupingModel;

      if (props.disableRowGrouping || rowGroupingModel.length === 0) {
        return null;
      }

      const distinctValues: {
        [field: string]: { lookup: { [val: string]: boolean }; list: any[] };
      } = Object.fromEntries(
        rowGroupingModel.map((groupingField) => [groupingField, { lookup: {}, list: [] }]),
      );

      const getCellGroupingCriteria = ({
        row,
        id,
        colDef,
      }: {
        row: GridRowModel;
        id: GridRowId;
        colDef: GridColDef<GridApiPro>;
      }) => {
        let key: GridKeyValue | null | undefined;
        if (colDef.groupingValueGetter) {
          const groupingValueGetterParams: GridGroupingValueGetterParams = {
            colDef,
            field: colDef.field,
            value: row[colDef.field],
            id,
            row,
            rowNode: {
              isAutoGenerated: false,
              id,
            },
          };
          key = colDef.groupingValueGetter(groupingValueGetterParams);
        } else {
          key = row[colDef.field] as GridKeyValue | null | undefined;
        }

        return {
          key,
          field: colDef.field,
        };
      };

      params.ids.forEach((rowId) => {
        const row = params.idRowsLookup[rowId];

        rowGroupingModel.forEach((groupingCriteria) => {
          const { key } = getCellGroupingCriteria({
            row,
            id: rowId,
            colDef: columnsLookup[groupingCriteria],
          });
          const groupingFieldsDistinctKeys = distinctValues[groupingCriteria];

          if (key != null && !groupingFieldsDistinctKeys.lookup[key.toString()]) {
            groupingFieldsDistinctKeys.lookup[key.toString()] = true;
            groupingFieldsDistinctKeys.list.push(key);
          }
        });
      });

      const rows = params.ids.map((rowId) => {
        const row = params.idRowsLookup[rowId];
        const parentPath = rowGroupingModel
          .map((groupingField) =>
            getCellGroupingCriteria({
              row,
              id: rowId,
              colDef: columnsLookup[groupingField],
            }),
          )
          .filter((cell) => cell.key != null) as BuildRowTreeGroupingCriteria[];

        const leafGroupingCriteria: BuildRowTreeGroupingCriteria = {
          key: rowId.toString(),
          field: null,
        };

        return {
          path: [...parentPath, leafGroupingCriteria],
          id: rowId,
        };
      });

      return buildRowTree({
        ...params,
        rows,
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: GROUPING_COLUMNS_FEATURE_NAME,
      });
    };

    return apiRef.current.unstable_registerRowGroupsBuilder('rowGrouping', groupRows);
  }, [
    apiRef,
    props.defaultGroupingExpansionDepth,
    props.isGroupExpandedByDefault,
    props.disableRowGrouping,
  ]);

  useFirstRender(() => {
    updateRowGrouping();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return () => {};
    }

    return updateRowGrouping();
  }, [updateRowGrouping]);

  /**
   * PRE-PROCESSING
   */
  const getGroupingColDefs = React.useCallback(
    (columnsState: GridColumnsRawState<GridApiPro>) => {
      if (props.disableRowGrouping) {
        return [];
      }

      const groupingColDefProp = props.groupingColDef;

      // We can't use `gridGroupingRowsSanitizedModelSelector` here because the new columns are not in the state yet
      const rowGroupingModel = gridRowGroupingModelSelector(apiRef).filter(
        (field) => !!columnsState.lookup[field],
      );

      if (rowGroupingModel.length === 0) {
        return [];
      }

      switch (props.rowGroupingColumnMode) {
        case 'single': {
          return [
            createGroupingColDefForAllGroupingCriteria({
              apiRef,
              rowGroupingModel,
              colDefOverride: getColDefOverrides(groupingColDefProp, rowGroupingModel),
              columnsLookup: columnsState.lookup,
            }),
          ];
        }

        case 'multiple': {
          return rowGroupingModel.map((groupingCriteria) =>
            createGroupingColDefForOneGroupingCriteria({
              groupingCriteria,
              colDefOverride: getColDefOverrides(groupingColDefProp, [groupingCriteria]),
              groupedByColDef: columnsState.lookup[groupingCriteria],
              columnsLookup: columnsState.lookup,
            }),
          );
        }

        default: {
          return [];
        }
      }
    },
    [apiRef, props.groupingColDef, props.rowGroupingColumnMode, props.disableRowGrouping],
  );

  const updateGroupingColumn = React.useCallback(
    (columnsState: GridColumnsRawState<GridApiPro>) => {
      const groupingColDefs = getGroupingColDefs(columnsState);
      let newColumnFields: string[] = [];
      const newColumnsLookup: GridColumnRawLookup<GridApiPro> = {};

      // We only keep the non-grouping columns
      columnsState.all.forEach((field) => {
        if (!isGroupingColumn(field)) {
          newColumnFields.push(field);
          newColumnsLookup[field] = columnsState.lookup[field];
        }
      });

      // We add the grouping column
      groupingColDefs.forEach((groupingColDef) => {
        const matchingGroupingColDef = columnsState.lookup[groupingColDef.field];
        if (matchingGroupingColDef) {
          groupingColDef.width = matchingGroupingColDef.width;
          groupingColDef.flex = matchingGroupingColDef.flex;
        }

        newColumnsLookup[groupingColDef.field] = groupingColDef;
      });
      const startIndex = newColumnFields[0] === '__check__' ? 1 : 0;
      newColumnFields = [
        ...newColumnFields.slice(0, startIndex),
        ...groupingColDefs.map((colDef) => colDef.field),
        ...newColumnFields.slice(startIndex),
      ];

      columnsState.all = newColumnFields;
      columnsState.lookup = newColumnsLookup;

      return columnsState;
    },
    [getGroupingColDefs],
  );

  const addColumnMenuButtons = React.useCallback(
    (initialValue: JSX.Element[], columns: GridStateColDef) => {
      if (props.disableRowGrouping) {
        return initialValue;
      }

      let menuItems: React.ReactNode;
      if (isGroupingColumn(columns.field)) {
        menuItems = <GridRowGroupingColumnMenuItems />;
      } else if (columns.groupable) {
        menuItems = <GridRowGroupableColumnMenuItems />;
      } else {
        menuItems = null;
      }

      if (menuItems == null) {
        return initialValue;
      }

      return [...initialValue, <Divider />, menuItems];
    },
    [props.disableRowGrouping],
  );

  const filteringMethod = React.useCallback<GridFilteringMethod>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);

      return filterRowTreeFromGroupingColumns({
        rowTree,
        isRowMatchingFilters: params.isRowMatchingFilters,
      });
    },
    [apiRef],
  );

  const sortingMethod = React.useCallback<GridSortingMethod>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);
      const rowIds = gridRowIdsSelector(apiRef);

      return sortRowTree({
        rowTree,
        rowIds,
        sortRowList: params.sortRowList,
        disableChildrenSorting: false,
      });
    },
    [apiRef],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterPreProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterFilteringMethod(apiRef, GROUPING_COLUMNS_FEATURE_NAME, filteringMethod);
  useGridRegisterSortingMethod(apiRef, GROUPING_COLUMNS_FEATURE_NAME, sortingMethod);

  /**
   * API METHODS
   */
  const setRowGroupingModel = React.useCallback<GridRowGroupingApi['setRowGroupingModel']>(
    (model) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      if (currentModel !== model) {
        apiRef.current.setState(mergeStateWithRowGroupingModel(model));
        updateRowGrouping();
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, updateRowGrouping],
  );

  const addRowGroupingCriteria = React.useCallback<GridRowGroupingApi['addRowGroupingCriteria']>(
    (field, groupingIndex) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      if (currentModel.includes(field)) {
        return;
      }

      const cleanGroupingIndex = groupingIndex ?? currentModel.length;

      const updatedModel = [
        ...currentModel.slice(0, cleanGroupingIndex),
        field,
        ...currentModel.slice(cleanGroupingIndex),
      ];

      apiRef.current.setRowGroupingModel(updatedModel);
    },
    [apiRef],
  );

  const removeRowGroupingCriteria = React.useCallback<
    GridRowGroupingApi['removeRowGroupingCriteria']
  >(
    (field) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      if (!currentModel.includes(field)) {
        return;
      }
      apiRef.current.setRowGroupingModel(currentModel.filter((el) => el !== field));
    },
    [apiRef],
  );

  const setRowGroupingCriteriaIndex = React.useCallback<
    GridRowGroupingApi['setRowGroupingCriteriaIndex']
  >(
    (field, targetIndex) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      const currentTargetIndex = currentModel.indexOf(field);

      if (currentTargetIndex === -1) {
        return;
      }

      const updatedModel = [...currentModel];
      updatedModel.splice(targetIndex, 0, updatedModel.splice(currentTargetIndex, 1)[0]);

      apiRef.current.setRowGroupingModel(updatedModel);
    },
    [apiRef],
  );

  const rowGroupingApi: GridRowGroupingApi = {
    setRowGroupingModel,
    addRowGroupingCriteria,
    removeRowGroupingCriteria,
    setRowGroupingCriteriaIndex,
  };

  useGridApiMethod(apiRef, rowGroupingApi, 'GridRowGroupingApi');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPreProcessor<'exportState'>>(
    (prevState) => {
      if (props.disableRowGrouping) {
        return prevState;
      }

      const rowGroupingModelToExport = gridRowGroupingModelSelector(apiRef);
      if (rowGroupingModelToExport.length === 0) {
        return prevState;
      }

      return {
        ...prevState,
        rowGrouping: {
          model: rowGroupingModelToExport,
        },
      };
    },
    [apiRef, props.disableRowGrouping],
  );

  const stateRestorePreProcessing = React.useCallback<GridPreProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePro>) => {
      if (props.disableRowGrouping) {
        return params;
      }

      const rowGroupingModel = context.stateToRestore.rowGrouping?.model;
      if (rowGroupingModel != null) {
        apiRef.current.setState(mergeStateWithRowGroupingModel(rowGroupingModel));
      }
      return params;
    },
    [apiRef, props.disableRowGrouping],
  );

  useGridRegisterPreProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPreProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (isGroupingColumn(cellParams.field) && event.key === ' ' && !event.shiftKey) {
        event.stopPropagation();
        event.preventDefault();

        const filteredDescendantCount =
          gridFilteredDescendantCountLookupSelector(apiRef)[params.id] ?? 0;

        const isOnGroupingCell =
          props.rowGroupingColumnMode === 'single' ||
          getRowGroupingFieldFromGroupingCriteria(params.rowNode.groupingField) === params.field;
        if (!isOnGroupingCell || filteredDescendantCount === 0) {
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef, props.rowGroupingColumnMode],
  );

  const checkGroupingColumnsModelDiff = React.useCallback<
    GridEventListener<GridEvents.columnsChange>
  >(() => {
    const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
    const lastGroupingColumnsModelApplied = sanitizedModelOnLastRowPreProcessing.current;

    if (!isDeepEqual(lastGroupingColumnsModelApplied, rowGroupingModel)) {
      sanitizedModelOnLastRowPreProcessing.current = rowGroupingModel;

      // Refresh the column pre-processing
      apiRef.current.updateColumns([]);
      updateRowGrouping();
    }
  }, [apiRef, updateRowGrouping]);

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, checkGroupingColumnsModelDiff);
  useGridApiEventHandler(apiRef, GridEvents.rowGroupingModelChange, checkGroupingColumnsModelDiff);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.rowGroupingModel !== undefined) {
      apiRef.current.setRowGroupingModel(props.rowGroupingModel);
    }
  }, [apiRef, props.rowGroupingModel]);
};
