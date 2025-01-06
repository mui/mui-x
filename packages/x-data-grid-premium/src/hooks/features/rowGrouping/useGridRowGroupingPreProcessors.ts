import * as React from 'react';
import {
  gridColumnLookupSelector,
  GridRowId,
  gridRowTreeSelector,
  useFirstRender,
  GRID_CHECKBOX_SELECTION_FIELD,
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
  getVisibleRowsLookup,
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
  RowGroupingStrategy,
  isGroupingColumn,
  setStrategyAvailability,
  getCellGroupingCriteria,
  getGroupingRules,
} from './gridRowGroupingUtils';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';

export const useGridRowGroupingPreProcessors = (
  apiRef: React.MutableRefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'disableRowGrouping'
    | 'groupingColDef'
    | 'rowGroupingColumnMode'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'unstable_dataSource'
  >,
) => {
  const getGroupingColDefs = React.useCallback(
    (columnsState: GridHydrateColumnsValue) => {
      if (props.disableRowGrouping) {
        return [];
      }

      const strategy = props.unstable_dataSource
        ? RowGroupingStrategy.DataSource
        : RowGroupingStrategy.Default;

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
              colDefOverride: getColDefOverrides(groupingColDefProp, rowGroupingModel, strategy),
              columnsLookup: columnsState.lookup,
              strategy,
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
              strategy,
            }),
          );
        }

        default: {
          return [];
        }
      }
    },
    [
      apiRef,
      props.groupingColDef,
      props.rowGroupingColumnMode,
      props.disableRowGrouping,
      props.unstable_dataSource,
    ],
  );

  const updateGroupingColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const groupingColDefs = getGroupingColDefs(columnsState);
      let newColumnFields: string[] = [];
      const newColumnsLookup: GridColumnRawLookup = {};
      const prevGroupingfields: string[] = [];

      // We only keep the non-grouping columns
      columnsState.orderedFields.forEach((field) => {
        if (isGroupingColumn(field)) {
          prevGroupingfields.push(field);
        } else {
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

      if (prevGroupingfields.length !== groupingColDefs.length) {
        const startIndex = newColumnFields[0] === GRID_CHECKBOX_SELECTION_FIELD ? 1 : 0;
        newColumnFields = [
          ...newColumnFields.slice(0, startIndex),
          ...groupingColDefs.map((colDef) => colDef.field),
          ...newColumnFields.slice(startIndex),
        ];
        columnsState.orderedFields = newColumnFields;
      }

      columnsState.lookup = newColumnsLookup;

      return columnsState;
    },
    [getGroupingColDefs],
  );

  const createRowTreeForRowGrouping = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
      const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
      const columnsLookup = gridColumnLookupSelector(apiRef);
      const groupingRules = getGroupingRules({
        sanitizedRowGroupingModel,
        columnsLookup,
      });
      apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;

      const getRowTreeBuilderNode = (rowId: GridRowId) => {
        const row = params.dataRowIdToModelLookup[rowId];
        const parentPath = groupingRules
          .map((groupingRule) =>
            getCellGroupingCriteria({
              row,
              groupingRule,
              colDef: columnsLookup[groupingRule.field],
              apiRef,
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
          previousTree: params.previousTree,
          nodes: params.updates.rows.map(getRowTreeBuilderNode),
          defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
          isGroupExpandedByDefault: props.isGroupExpandedByDefault,
          groupingName: RowGroupingStrategy.Default,
        });
      }

      return updateRowTree({
        nodes: {
          inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
          modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
          removed: params.updates.actions.remove,
        },
        previousTree: params.previousTree!,
        previousTreeDepth: params.previousTreeDepths!,
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: RowGroupingStrategy.Default,
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
        filterModel: params.filterModel,
        apiRef,
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
        shouldRenderGroupBelowLeaves: true,
      });
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(
    apiRef,
    RowGroupingStrategy.Default,
    'rowTreeCreation',
    createRowTreeForRowGrouping,
  );
  useGridRegisterStrategyProcessor(apiRef, RowGroupingStrategy.Default, 'filtering', filterRows);
  useGridRegisterStrategyProcessor(apiRef, RowGroupingStrategy.Default, 'sorting', sortRows);
  useGridRegisterStrategyProcessor(
    apiRef,
    RowGroupingStrategy.Default,
    'visibleRowsLookupCreation',
    getVisibleRowsLookup,
  );

  useFirstRender(() => {
    setStrategyAvailability(apiRef, props.disableRowGrouping, props.unstable_dataSource);
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (!isFirstRender.current) {
      setStrategyAvailability(apiRef, props.disableRowGrouping, props.unstable_dataSource);
    } else {
      isFirstRender.current = false;
    }
  }, [apiRef, props.disableRowGrouping, props.unstable_dataSource]);
};
