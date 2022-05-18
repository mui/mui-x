import * as React from 'react';
import {
  GRID_ROOT_GROUP_ID,
  gridColumnLookupSelector,
  gridFilteredRowsLookupSelector,
  GridGroupNode,
  GridRowId,
  gridRowTreeSelector,
} from '@mui/x-data-grid-pro';
import { GridApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  GridAggregationFunction,
  GridAggregationLookup,
  GridAggregationRules,
} from './gridAggregationInterfaces';
import { getAggregationRules } from './gridAggregationUtils';
import { gridAggregationModelSelector } from './gridAggregationSelectors';

const getAggregationCellValue = ({
  apiRef,
  groupId,
  field,
  aggregationFunction,
  aggregatedRows,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  groupId: GridRowId;
  field: string;
  aggregationFunction: GridAggregationFunction;
  aggregatedRows: DataGridPremiumProcessedProps['aggregatedRows'];
}) => {
  const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);

  let rowIds: GridRowId[] = apiRef.current.getRowGroupChildren({ groupId });

  if (aggregatedRows === 'filtered') {
    rowIds = rowIds.filter((rowId) => filteredRowsLookup[rowId] !== false);
  }

  return aggregationFunction.apply({
    values: rowIds.map((rowId) => apiRef.current.getCellValue(rowId, field)),
  });
};

const getGroupAggregatedValue = ({
  groupId,
  apiRef,
  aggregatedRows,
  aggregatedFields,
  aggregationRules,
  isGroupAggregated,
}: {
  groupId: GridRowId;
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregatedRows: DataGridPremiumProcessedProps['aggregatedRows'];
  aggregatedFields: string[];
  aggregationRules: GridAggregationRules;
  isGroupAggregated: DataGridPremiumProcessedProps['isGroupAggregated'];
}) => {
  const groupAggregationLookup: GridAggregationLookup[GridRowId] = {};
  const groupNode = apiRef.current.getRowNode<GridGroupNode>(groupId)!;

  for (let j = 0; j < aggregatedFields.length; j += 1) {
    const aggregatedField = aggregatedFields[j];
    const columnAggregationRules = aggregationRules[aggregatedField];
    const columnAggregationLookup: GridAggregationLookup[GridRowId][string] = {};

    if (
      columnAggregationRules.inline &&
      (!isGroupAggregated || isGroupAggregated(groupNode, 'inline'))
    ) {
      columnAggregationLookup.inline = getAggregationCellValue({
        apiRef,
        groupId,
        field: aggregatedField,
        aggregationFunction: columnAggregationRules.inline.aggregationFunction,
        aggregatedRows,
      });
    }

    if (
      columnAggregationRules.footer &&
      (!isGroupAggregated || isGroupAggregated(groupNode, 'footer'))
    ) {
      columnAggregationLookup.footer = getAggregationCellValue({
        apiRef,
        groupId,
        field: aggregatedField,
        aggregationFunction: columnAggregationRules.footer.aggregationFunction,
        aggregatedRows,
      });
    }

    groupAggregationLookup[aggregatedField] = columnAggregationLookup;
  }

  return groupAggregationLookup;
};

export const createAggregationLookup = ({
  apiRef,
  aggregationFunctions,
  aggregatedRows,
  isGroupAggregated,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationFunctions: Record<string, GridAggregationFunction>;
  aggregatedRows: DataGridPremiumProcessedProps['aggregatedRows'];
  isGroupAggregated: DataGridPremiumProcessedProps['isGroupAggregated'];
}): GridAggregationLookup => {
  const aggregationRules = getAggregationRules({
    columnsLookup: gridColumnLookupSelector(apiRef),
    aggregationModel: gridAggregationModelSelector(apiRef),
    aggregationFunctions,
  });

  const aggregatedFields = Object.keys(aggregationRules);
  if (aggregatedFields.length === 0) {
    return {};
  }

  const aggregationLookup: GridAggregationLookup = {};
  const rowTree = gridRowTreeSelector(apiRef);

  const createGroupAggregationLookup = (groupNode: GridGroupNode) => {
    let hasAggregableChildren = false;
    for (let i = 0; i < groupNode.children.length; i += 1) {
      const childId = groupNode.children[i];
      const childNode = rowTree[childId];

      if (childNode.type === 'group') {
        createGroupAggregationLookup(childNode);
      }

      if (childNode.type === 'leaf' || childNode.type === 'group') {
        hasAggregableChildren = true;
      }
    }

    if (hasAggregableChildren) {
      aggregationLookup[groupNode.id] = getGroupAggregatedValue({
        groupId: groupNode.id,
        apiRef,
        aggregatedFields,
        aggregatedRows,
        aggregationRules,
        isGroupAggregated,
      });
    }
  };

  createGroupAggregationLookup(rowTree[GRID_ROOT_GROUP_ID] as GridGroupNode);

  return aggregationLookup;
};
