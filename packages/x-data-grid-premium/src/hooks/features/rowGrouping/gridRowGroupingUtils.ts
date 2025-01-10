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
  gridColumnFieldsSelector,
} from '@mui/x-data-grid-pro';
import {
  passFilterLogic,
  GridAggregatedFilterItemApplier,
  GridAggregatedFilterItemApplierResult,
  GridColumnRawLookup,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
  getRowGroupingCriteriaFromGroupingField,
  isGroupingColumn,
  GridStrategyGroup,
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

interface FilterRowTreeFromTreeDataParams {
  rowTree: GridRowTreeConfig;
  isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
  filterModel: GridFilterModel;
  apiRef: React.MutableRefObject<GridPrivateApiPremium>;
  rowGroupingColumnMode: 'single' | 'multiple';
  groupingColDef: DataGridPremiumProcessedProps['groupingColDef'];
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
  const {
    apiRef,
    rowTree,
    isRowMatchingFilters,
    filterModel,
    rowGroupingColumnMode,
    groupingColDef,
  } = params;
  const filteredRowsLookup: Record<GridRowId, boolean> = {};
  const filteredChildrenCountLookup: Record<GridRowId, number> = {};
  const filteredDescendantCountLookup: Record<GridRowId, number> = {};
  const filterCache = {};

  const getGroupingCriteria = () => {
    const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
    const colDefOverride = getColDefOverrides(groupingColDef, rowGroupingModel);
    const orderedFields = gridColumnFieldsSelector(apiRef);
    const { leafField, mainGroupingCriteria } = colDefOverride ?? {};
    const isLeafField = leafField ? orderedFields.includes(leafField) : null;
    if (mainGroupingCriteria && rowGroupingModel.includes(mainGroupingCriteria)) {
      return mainGroupingCriteria;
    }
    if (isLeafField) {
      return null;
    }
    return rowGroupingModel[0];
  };

  const shouldFilterGroup = (node: GridTreeNode): boolean => {
    if (node.type === 'group' && node.isAutoGenerated) {
      const groupingCriteria = getGroupingCriteria();
      if (!groupingCriteria) {
        return false;
      }
      const groupingField = getRowGroupingFieldFromGroupingCriteria(groupingCriteria);
      const groupFilterItems: string[] = [groupingField];
      const leafFilterItems: string[] = [];
      filterModel.items.forEach((item) => {
        if (isGroupingColumn(item.field)) {
          groupFilterItems.push(item.field);
        } else {
          leafFilterItems.push(item.field);
        }
      });

      if (leafFilterItems.length > 0 || filterModel.quickFilterValues?.length! > 0) {
        return false;
      }

      const nodeGroupingField = getRowGroupingFieldFromGroupingCriteria(node.groupingField);

      if (rowGroupingColumnMode === 'multiple') {
        return nodeGroupingField === groupFilterItems[groupFilterItems.length - 1];
      }

      return nodeGroupingField === groupingField;
    }

    return false;
  };

  const filterTreeNode = (
    node: GridTreeNode,
    areAncestorsExpanded: boolean,
    isParentPassingFilter: boolean,
    shouldFilterParent: boolean,
    ancestorsResults: GridAggregatedFilterItemApplierResult[],
  ): number => {
    const filterResults: GridAggregatedFilterItemApplierResult = {
      passingFilterItems: null,
      passingQuickFilterValues: null,
    };

    let isPassingFiltering = false;
    let allowGroupToFilter = shouldFilterGroup(node);
    if (isRowMatchingFilters && node.type !== 'footer') {
      const shouldApplyItem =
        node.type === 'group' && node.isAutoGenerated
          ? (columnField: string) => shouldApplyFilterItemOnGroup(columnField, node)
          : undefined;

      const row = apiRef.current.getRow(node.id);
      isRowMatchingFilters(row, shouldApplyItem, filterResults);
      const allResults = [...ancestorsResults, filterResults];
      isPassingFiltering = passFilterLogic(
        allResults.map((result) => result.passingFilterItems),
        allResults.map((result) => result.passingQuickFilterValues),
        filterModel,
        params.apiRef,
        filterCache,
      );
    } else {
      isPassingFiltering = true;
    }

    let filteredChildrenCount = 0;
    let filteredDescendantCount = 0;

    if (shouldFilterParent && node.type !== 'footer') {
      isPassingFiltering = isParentPassingFilter;
      allowGroupToFilter = shouldFilterParent;
    }

    // in case of multiple column filtering we pass ancestors filter results
    if (filterModel.items.length > 1) {
      ancestorsResults = [...ancestorsResults, filterResults];
    }

    if (node.type === 'group') {
      node.children.forEach((childId) => {
        const childNode = rowTree[childId];
        const childSubTreeSize = filterTreeNode(
          childNode,
          areAncestorsExpanded && !!node.childrenExpanded,
          isPassingFiltering,
          allowGroupToFilter,
          ancestorsResults,
        );
        filteredDescendantCount += childSubTreeSize;
        if (childSubTreeSize > 0) {
          filteredChildrenCount += 1;
        }
      });
    }

    if (node.type === 'group' && !shouldFilterParent) {
      isPassingFiltering = filteredDescendantCount > 0;
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
      filterTreeNode(node, true, true, false, []);
    }
  }

  return {
    filteredRowsLookup,
    filteredChildrenCountLookup,
    filteredDescendantCountLookup,
  };
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

  privateApiRef.current.setStrategyAvailability(GridStrategyGroup.RowTree, strategy, isAvailable);
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
