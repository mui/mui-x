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
  GridDataSource,
} from '@mui/x-data-grid-pro';
import {
  passFilterLogic,
  GridAggregatedFilterItemApplier,
  GridAggregatedFilterItemApplierResult,
  GridColumnRawLookup,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  getRowGroupingCriteriaFromGroupingField,
  isGroupingColumn,
} from '@mui/x-data-grid-pro/internals';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  GridGroupingRule,
  GridGroupingRules,
  GridRowGroupingModel,
} from './gridRowGroupingInterfaces';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { gridRowGroupingSanitizedModelSelector } from './gridRowGroupingSelector';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';

export {
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  getRowGroupingCriteriaFromGroupingField,
  isGroupingColumn,
};

export enum RowGroupingStrategy {
  Default = 'grouping-columns',
  DataSource = 'grouping-columns-data-source',
}

export const getRowGroupingFieldFromGroupingCriteria = (groupingCriteria: string | null) => {
  if (groupingCriteria === null) {
    return GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD;
  }

  return `__row_group_by_columns_group_${groupingCriteria}__`;
};

interface FilterRowTreeFromTreeDataParams {
  rowTree: GridRowTreeConfig;
  isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
  filterModel: GridFilterModel;
  apiRef: React.MutableRefObject<GridPrivateApiPremium>;
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
  const { apiRef, rowTree, isRowMatchingFilters, filterModel } = params;
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredChildrenCountLookup: Record<GridRowId, number> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};
  const filterCache = {};

  const filterTreeNode = (
    node: GridTreeNode,
    areAncestorsExpanded: boolean,
    ancestorsResults: GridAggregatedFilterItemApplierResult[],
  ): number => {
    const filterResults: GridAggregatedFilterItemApplierResult = {
      passingFilterItems: null,
      passingQuickFilterValues: null,
    };

    let isPassingFiltering = false;

    if (isRowMatchingFilters && node.type !== 'footer') {
      const shouldApplyItem =
        node.type === 'group' && node.isAutoGenerated
          ? (columnField: string) => shouldApplyFilterItemOnGroup(columnField, node)
          : undefined;

      const row = apiRef.current.getRow(node.id);
      isRowMatchingFilters(row, shouldApplyItem, filterResults);
    } else {
      isPassingFiltering = true;
    }

    let filteredChildrenCount = 0;
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
        if (childSubTreeSize > 0) {
          filteredChildrenCount += 1;
        }
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
          filterCache,
        );
      }
    }

    filteredRowsLookup[node.id] = isPassingFiltering;

    if (!isPassingFiltering) {
      return 0;
    }

    filteredChildrenCountLookup[node.id] = filteredChildrenCount;
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
    filteredRowsLookup,
    filteredChildrenCountLookup,
    filteredDescendantCountLookup,
  };
};

export const getColDefOverrides = (
  groupingColDefProp: DataGridPremiumProcessedProps['groupingColDef'],
  fields: string[],
  strategy?: RowGroupingStrategy,
) => {
  if (typeof groupingColDefProp === 'function') {
    return groupingColDefProp({
      groupingName: strategy ?? RowGroupingStrategy.Default,
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
  privateApiRef: React.MutableRefObject<GridPrivateApiPremium>,
  disableRowGrouping: boolean,
  dataSource?: GridDataSource,
) => {
  let isAvailable: () => boolean;
  if (disableRowGrouping) {
    isAvailable = () => false;
  } else {
    isAvailable = () => {
      const rowGroupingSanitizedModel = gridRowGroupingSanitizedModelSelector(privateApiRef);
      return rowGroupingSanitizedModel.length > 0;
    };
  }

  const strategy = dataSource ? RowGroupingStrategy.DataSource : RowGroupingStrategy.Default;

  privateApiRef.current.setStrategyAvailability('rowTree', strategy, isAvailable);
};

export const getCellGroupingCriteria = ({
  row,
  colDef,
  groupingRule,
  apiRef,
}: {
  row: GridRowModel;
  colDef: GridColDef;
  groupingRule: GridGroupingRule;
  apiRef: React.MutableRefObject<GridPrivateApiPremium>;
}) => {
  let key: GridKeyValue | null | undefined;
  if (groupingRule.groupingValueGetter) {
    key = groupingRule.groupingValueGetter(row[groupingRule.field] as never, row, colDef, apiRef);
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
  newValue: GridGroupingRules,
  previousValue: GridGroupingRules,
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
