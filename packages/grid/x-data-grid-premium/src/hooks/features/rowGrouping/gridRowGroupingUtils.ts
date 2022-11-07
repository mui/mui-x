import * as React from 'react';
import {
  GridRowId,
  GridRowTreeConfig,
  GridFilterState,
  GridFilterModel,
  GridTreeNode,
  GridGroupNode,
  GridRowModel,
  GridColDef,
  GridKeyValue,
} from '@mui/x-data-grid-pro';
import {
  passFilterLogic,
  GridAggregatedFilterItemApplier,
  GridColumnRawLookup,
  GridApiCommunity,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridGroupingValueGetterParams } from '../../../models/gridGroupingValueGetterParams';
import {
  GridGroupingRule,
  GridGroupingRules,
  GridRowGroupingModel,
} from './gridRowGroupingInterfaces';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { gridRowGroupingSanitizedModelSelector } from './gridRowGroupingSelector';
import { GridApiPremium } from '../../../models/gridApiPremium';

export const GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD = '__row_group_by_columns_group__';

export const ROW_GROUPING_STRATEGY = 'grouping-columns';

export const getRowGroupingFieldFromGroupingCriteria = (groupingCriteria: string | null) => {
  if (groupingCriteria === null) {
    return GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD;
  }

  return `__row_group_by_columns_group_${groupingCriteria}__`;
};

export const getRowGroupingCriteriaFromGroupingField = (groupingColDefField: string) => {
  const match = groupingColDefField.match(/^__row_group_by_columns_group_(.*)__$/);

  if (!match) {
    return null;
  }

  return match[1];
};

export const isGroupingColumn = (field: string) =>
  field === GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD ||
  getRowGroupingCriteriaFromGroupingField(field) !== null;

interface FilterRowTreeFromTreeDataParams {
  rowTree: GridRowTreeConfig;
  isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
  filterModel: GridFilterModel;
  apiRef: React.MutableRefObject<GridApiCommunity>;
}

/**
 * When filtering a group, we only want to filter according to the items related to this grouping column.
 */
const shouldApplyFilterItemOnGroup = (columnField: string, node: GridGroupNode) => {
  if (columnField === GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD) {
    return true;
  }

  const groupingCriteriaField = getRowGroupingCriteriaFromGroupingField(columnField);

  return groupingCriteriaField === node.groupingField;
};

/**
 * A leaf is visible if it passed the filter
 * A group is visible if all the following criteria are met:
 * - One of its children is passing the filter
 * - It is passing the filter
 */
export const filterRowTreeFromGroupingColumns = (
  params: FilterRowTreeFromTreeDataParams,
): Omit<GridFilterState, 'filterModel'> => {
  const { rowTree, isRowMatchingFilters, filterModel } = params;
  const visibleRowsLookup: Record<GridRowId, boolean> = {};
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};

  const filterTreeNode = (
    node: GridTreeNode,
    areAncestorsExpanded: boolean,
    ancestorsResults: ReturnType<GridAggregatedFilterItemApplier>[],
  ): number => {
    let isPassingFiltering = false;
    let filterResults: ReturnType<GridAggregatedFilterItemApplier> = {
      passingFilterItems: null,
      passingQuickFilterValues: null,
    };

    if (isRowMatchingFilters && node.type !== 'footer') {
      const shouldApplyItem =
        node.type === 'group' && node.isAutoGenerated
          ? (columnField: string) => shouldApplyFilterItemOnGroup(columnField, node)
          : undefined;

      filterResults = isRowMatchingFilters(node.id, shouldApplyItem);
    } else {
      isPassingFiltering = true;
    }

    let filteredDescendantCount = 0;
    if (node.type === 'group') {
      node.children.forEach((childId) => {
        const childNode = rowTree[childId];
        const childSubTreeSize = filterTreeNode(
          childNode,

          areAncestorsExpanded && !!node.childrenExpanded,
          [...ancestorsResults, filterResults],
        );
        filteredDescendantCount += childSubTreeSize;
      });
    }

    if (isPassingFiltering === false) {
      if (node.type === 'group') {
        // If node has children - it's passing if at least one child passes filters
        isPassingFiltering = filteredDescendantCount > 0;
      } else {
        const allResults = [...ancestorsResults, filterResults];
        isPassingFiltering = passFilterLogic(
          allResults.map((result) => result.passingFilterItems),
          allResults.map((result) => result.passingQuickFilterValues),
          filterModel,
          params.apiRef,
        );
      }
    }

    visibleRowsLookup[node.id] = isPassingFiltering && areAncestorsExpanded;
    filteredRowsLookup[node.id] = isPassingFiltering;

    // TODO rows v6: Should we keep storing the visibility status of footer independently or rely on the group visibility in the selector ?
    if (node.type === 'group' && node.footerId != null) {
      visibleRowsLookup[node.footerId] =
        isPassingFiltering && areAncestorsExpanded && !!node.childrenExpanded;
    }

    if (!isPassingFiltering) {
      return 0;
    }

    filteredDescendantCountLookup[node.id] = filteredDescendantCount;

    if (node.type !== 'group') {
      return filteredDescendantCount + 1;
    }

    return filteredDescendantCount;
  };

  const nodes = Object.values(rowTree);
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.depth === 0) {
      filterTreeNode(node, true, []);
    }
  }

  return {
    visibleRowsLookup,
    filteredRowsLookup,
    filteredDescendantCountLookup,
  };
};

export const getColDefOverrides = (
  groupingColDefProp: DataGridPremiumProcessedProps['groupingColDef'],
  fields: string[],
) => {
  if (typeof groupingColDefProp === 'function') {
    return groupingColDefProp({
      groupingName: ROW_GROUPING_STRATEGY,
      fields,
    });
  }

  return groupingColDefProp;
};

export const mergeStateWithRowGroupingModel =
  (rowGroupingModel: GridRowGroupingModel) =>
  (state: GridStatePremium): GridStatePremium => ({
    ...state,
    rowGrouping: { ...state.rowGrouping, model: rowGroupingModel },
  });

export const setStrategyAvailability = (
  apiRef: React.MutableRefObject<GridApiPremium>,
  disableRowGrouping: boolean,
) => {
  let isAvailable: () => boolean;
  if (disableRowGrouping) {
    isAvailable = () => false;
  } else {
    isAvailable = () => {
      const rowGroupingSanitizedModel = gridRowGroupingSanitizedModelSelector(apiRef);
      return rowGroupingSanitizedModel.length > 0;
    };
  }

  apiRef.current.unstable_setStrategyAvailability('rowTree', ROW_GROUPING_STRATEGY, isAvailable);
};

export const getCellGroupingCriteria = ({
  row,
  id,
  colDef,
  groupingRule,
}: {
  row: GridRowModel;
  id: GridRowId;
  colDef: GridColDef;
  groupingRule: GridGroupingRule;
}) => {
  let key: GridKeyValue | null | undefined;
  if (groupingRule.groupingValueGetter) {
    const groupingValueGetterParams: GridGroupingValueGetterParams = {
      colDef,
      field: groupingRule.field,
      value: row[groupingRule.field],
      id,
      row,
      rowNode: {
        isAutoGenerated: false,
        id,
      },
    };
    key = groupingRule.groupingValueGetter(groupingValueGetterParams);
  } else {
    key = row[groupingRule.field] as GridKeyValue | null | undefined;
  }

  return {
    key,
    field: groupingRule.field,
  };
};

export const getGroupingRules = ({
  sanitizedRowGroupingModel,
  columnsLookup,
}: {
  sanitizedRowGroupingModel: GridRowGroupingModel;
  columnsLookup: GridColumnRawLookup;
}): GridGroupingRules =>
  sanitizedRowGroupingModel.map((field) => ({
    field,
    groupingValueGetter: columnsLookup[field]?.groupingValueGetter,
  }));

/**
 * Compares two sets of grouping rules to determine if they are equal or not.
 */
export const areGroupingRulesEqual = (
  previousValue: GridGroupingRules = [],
  newValue: GridGroupingRules,
) => {
  if (previousValue.length !== newValue.length) {
    return false;
  }

  return newValue.every((newRule, newRuleIndex) => {
    const previousRule = previousValue[newRuleIndex];

    if (previousRule.groupingValueGetter !== newRule.groupingValueGetter) {
      return false;
    }

    if (previousRule.field !== newRule.field) {
      return false;
    }

    return true;
  });
};
