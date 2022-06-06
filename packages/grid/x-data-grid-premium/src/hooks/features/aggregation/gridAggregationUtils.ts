import * as React from 'react';
import { capitalize } from '@mui/material';
import {
  GridColDef,
  GridRowId,
  GRID_ROOT_GROUP_ID,
  GridFooterNode,
  GridGroupNode,
} from '@mui/x-data-grid-pro';
import {
  GridColumnRawLookup,
  GridHydrateRowsValue,
  isDeepEqual,
  insertNodeInTree,
  removeNodeFromTree,
} from '@mui/x-data-grid-pro/internals';
import {
  GridAggregationFunction,
  GridAggregationModel,
  GridAggregationRule,
  GridAggregationRules,
} from './gridAggregationInterfaces';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridApiPremium } from '../../../models/gridApiPremium';

export const GRID_AGGREGATION_ROOT_FOOTER_ROW_ID = 'auto-generated-group-footer-root';

export const getAggregationFooterRowIdFromGroupId = (groupId: GridRowId | null) => {
  if (groupId == null) {
    return GRID_AGGREGATION_ROOT_FOOTER_ROW_ID;
  }

  return `auto-generated-group-footer-${groupId}`;
};

export const canColumnHaveAggregationFunction = ({
  column,
  aggregationFunctionName,
  aggregationFunction,
}: {
  column: GridColDef | undefined;
  aggregationFunctionName: string;
  aggregationFunction: GridAggregationFunction | undefined;
}): boolean => {
  if (!column || !column.aggregable) {
    return false;
  }

  if (!aggregationFunction) {
    return false;
  }

  if (column.availableAggregationFunctions != null) {
    return column.availableAggregationFunctions.includes(aggregationFunctionName);
  }

  if (!aggregationFunction.columnTypes) {
    return true;
  }

  return aggregationFunction.columnTypes.includes(column.type!);
};

export const getAvailableAggregationFunctions = ({
  aggregationFunctions,
  column,
}: {
  aggregationFunctions: Record<string, GridAggregationFunction>;
  column: GridColDef;
}) =>
  Object.keys(aggregationFunctions).filter((aggregationFunctionName) =>
    canColumnHaveAggregationFunction({
      column,
      aggregationFunctionName,
      aggregationFunction: aggregationFunctions[aggregationFunctionName],
    }),
  );

export const mergeStateWithAggregationModel =
  (aggregationModel: GridAggregationModel) =>
  (state: GridStatePremium): GridStatePremium => ({
    ...state,
    aggregation: { ...state.aggregation, model: aggregationModel },
  });

export const getAggregationRules = ({
  columnsLookup,
  aggregationModel,
  aggregationFunctions,
}: {
  columnsLookup: GridColumnRawLookup;
  aggregationModel: GridAggregationModel;
  aggregationFunctions: Record<string, GridAggregationFunction>;
}) => {
  const aggregationRules: GridAggregationRules = {};

  Object.entries(aggregationModel).forEach(([field, columnItem]) => {
    if (
      columnsLookup[field] &&
      canColumnHaveAggregationFunction({
        column: columnsLookup[field],
        aggregationFunctionName: columnItem,
        aggregationFunction: aggregationFunctions[columnItem],
      })
    ) {
      aggregationRules[field] = {
        aggregationFunctionName: columnItem,
        aggregationFunction: aggregationFunctions[columnItem],
      };
    }
  });

  return aggregationRules;
};

/**
 * Add a footer for each group that has at least one column with an aggregated value.
 */
export const addFooterRows = (
  params: GridHydrateRowsValue & {
    getAggregationPosition: DataGridPremiumProcessedProps['getAggregationPosition'];
    hasAggregationRule: boolean;
  },
) => {
  const tree = { ...params.tree };
  const treeDepths = { ...params.treeDepths };

  const addGroupFooter = (groupNode: GridGroupNode) => {
    if (params.hasAggregationRule && params.getAggregationPosition(groupNode) === 'footer') {
      const footerId = getAggregationFooterRowIdFromGroupId(groupNode.id);
      if (groupNode.footerId !== footerId) {
        if (groupNode.footerId != null) {
          removeNodeFromTree({ node: tree[groupNode.footerId], tree, treeDepths });
        }

        const footerNode: GridFooterNode = {
          id: footerId,
          parent: groupNode.id,
          depth: groupNode ? groupNode.depth + 1 : 0,
          type: 'footer',
        };

        insertNodeInTree({
          node: footerNode,
          tree,
          treeDepths,
        });
      }
    } else if (groupNode.footerId != null) {
      removeNodeFromTree({ node: tree[groupNode.footerId], tree, treeDepths });

      tree[groupNode.id] = {
        ...(tree[groupNode.id] as GridGroupNode),
        footerId: null,
      };
    }

    groupNode.children.forEach((childId) => {
      const childNode = tree[childId];
      if (childNode.type === 'group') {
        addGroupFooter(childNode);
      }
    });
  };

  addGroupFooter(tree[GRID_ROOT_GROUP_ID] as GridGroupNode);

  return {
    tree,
    treeDepths,
  };
};

/**
 * Compares two sets of aggregation rules to determine if they are equal or not.
 */
export const hasAggregationRulesChanged = (
  previousValue: GridAggregationRules | undefined,
  newValue: GridAggregationRules,
) => {
  const previousFields = Object.keys(previousValue ?? {});
  const newFields = Object.keys(newValue);

  if (!isDeepEqual(previousFields, newFields)) {
    return true;
  }

  return newFields.some((field) => {
    const previousRule = previousValue?.[field];
    const newRule = newValue[field];

    if (previousRule?.aggregationFunction !== newRule?.aggregationFunction) {
      return true;
    }

    if (previousRule?.aggregationFunctionName !== newRule?.aggregationFunctionName) {
      return true;
    }

    return false;
  });
};

export const getAggregationFunctionLabel = ({
  apiRef,
  aggregationRule,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationRule: GridAggregationRule;
}): string => {
  if (aggregationRule.aggregationFunction.label != null) {
    return aggregationRule.aggregationFunction.label;
  }

  try {
    return apiRef.current.getLocaleText(
      `aggregationFunctionLabel${capitalize(
        aggregationRule.aggregationFunctionName,
      )}` as 'aggregationFunctionLabelSum',
    );
  } catch (e) {
    return aggregationRule.aggregationFunctionName;
  }
};
