import * as React from 'react';
import {
  gridColumnLookupSelector,
  GridRowId,
  gridRowTreeSelector,
  useFirstRender,
} from '@mui/x-data-grid-pro';
import {
  useGridRegisterPipeProcessor,
  GridColumnRawLookup,
  GridPipeProcessor,
  GridHydrateColumnsValue,
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
  sortRowTree,
  createRowTree,
  updateRowTree,
  RowTreeBuilderGroupingCriterion,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  gridRowGroupingModelSelector,
  gridRowGroupingSanitizedModelSelector,
} from './gridRowGroupingSelector';
import {
  createGroupingColDefForAllGroupingCriteria,
  createGroupingColDefForOneGroupingCriteria,
} from './createGroupingColDef';
import {
  filterRowTreeFromGroupingColumns,
  getColDefOverrides,
  ROW_GROUPING_STRATEGY,
  isGroupingColumn,
  setStrategyAvailability,
  getCellGroupingCriteria,
} from './gridRowGroupingUtils';
import { GridApiPremium } from '../../../models/gridApiPremium';

export const useGridRowGroupingPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'disableRowGrouping'
    | 'groupingColDef'
    | 'rowGroupingColumnMode'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
  >,
) => {
  const getGroupingColDefs = React.useCallback(
    (columnsState: GridHydrateColumnsValue) => {
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

  const updateGroupingColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const groupingColDefs = getGroupingColDefs(columnsState);
      let newColumnFields: string[] = [];
      const newColumnsLookup: GridColumnRawLookup = {};

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

  const createRowTreeForRowGrouping = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
      const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const columnsLookup = gridColumnLookupSelector(apiRef);
      apiRef.current.unstable_caches.rowGrouping.sanitizedModelOnLastRowTreeCreation =
        rowGroupingModel;

      const getRowTreeBuilderNode = (rowId: GridRowId) => {
        const row = params.dataRowIdToModelLookup[rowId];
        const parentPath = rowGroupingModel
          .map((groupingField) =>
            getCellGroupingCriteria({
              row,
              id: rowId,
              colDef: columnsLookup[groupingField],
            }),
          )
          .filter((cell) => cell.key != null) as RowTreeBuilderGroupingCriterion[];

        const leafGroupingCriteria: RowTreeBuilderGroupingCriterion = {
          key: rowId.toString(),
          field: null,
        };

        return {
          path: [...parentPath, leafGroupingCriteria],
          id: rowId,
        };
      };

      if (params.updates.type === 'full') {
        return createRowTree({
          nodes: params.updates.rows.map(getRowTreeBuilderNode),
          autoGeneratedRowIdToIdLookup: params.autoGeneratedRowIdToIdLookup,
          defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
          isGroupExpandedByDefault: props.isGroupExpandedByDefault,
          groupingName: ROW_GROUPING_STRATEGY,
        });
      }

      return updateRowTree({
        nodes: {
          inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
          modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
          removed: params.updates.actions.remove,
        },
        autoGeneratedRowIdToIdLookup: params.autoGeneratedRowIdToIdLookup,
        previousTree: params.previousTree!,
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: ROW_GROUPING_STRATEGY,
      });
    },
    [apiRef, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);

      return filterRowTreeFromGroupingColumns({
        rowTree,
        isRowMatchingFilters: params.isRowMatchingFilters,
      });
    },
    [apiRef],
  );

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);

      return sortRowTree({
        rowTree,
        sortRowList: params.sortRowList,
        disableChildrenSorting: false,
      });
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(
    apiRef,
    ROW_GROUPING_STRATEGY,
    'rowTreeCreation',
    createRowTreeForRowGrouping,
  );
  useGridRegisterStrategyProcessor(apiRef, ROW_GROUPING_STRATEGY, 'filtering', filterRows);
  useGridRegisterStrategyProcessor(apiRef, ROW_GROUPING_STRATEGY, 'sorting', sortRows);

  /**
   * 1ST RENDER
   */
  useFirstRender(() => {
    setStrategyAvailability(apiRef, props.disableRowGrouping);
  });

  /**
   * EFFECTS
   */
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (!isFirstRender.current) {
      setStrategyAvailability(apiRef, props.disableRowGrouping);
    } else {
      isFirstRender.current = false;
    }
  }, [apiRef, props.disableRowGrouping]);
};
