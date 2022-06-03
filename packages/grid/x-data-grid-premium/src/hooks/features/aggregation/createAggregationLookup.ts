import * as React from 'react';
import {
  gridColumnLookupSelector,
  gridFilteredRowsLookupSelector,
  GridRowId,
  GridGroupNode,
  GridLeafNode,
  gridRowTreeSelector,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-pro';
import { GridApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  GridAggregationFunction,
  GridAggregationLookup,
  GridAggregationPosition,
  GridAggregationRules,
} from './gridAggregationInterfaces';
import { getAggregationRules } from './gridAggregationUtils';
import { gridAggregationModelSelector } from './gridAggregationSelectors';

const getAggregationCellValue = ({
  apiRef,
  groupId,
  field,
  aggregationFunction,
  aggregationRowsScope,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  groupId: GridRowId;
  field: string;
  aggregationFunction: GridAggregationFunction;
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'];
}) => {
  const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);

  let rowIds: GridRowId[] = apiRef.current.getRowGroupChildren({ groupId });

  if (aggregationRowsScope === 'filtered') {
    rowIds = rowIds.filter((rowId) => filteredRowsLookup[rowId] !== false);
  }

  return aggregationFunction.apply({
    values: rowIds.map((rowId) => apiRef.current.getCellValue(rowId, field)),
  });
};

const getGroupAggregatedValue = ({
  groupId,
  apiRef,
  aggregationRowsScope,
  aggregatedFields,
  aggregationRules,
  position,
}: {
  groupId: GridRowId;
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'];
  aggregatedFields: string[];
  aggregationRules: GridAggregationRules;
  position: GridAggregationPosition;
}) => {
  const groupAggregationLookup: GridAggregationLookup[GridRowId] = {};

  for (let j = 0; j < aggregatedFields.length; j += 1) {
    const aggregatedField = aggregatedFields[j];
    const columnAggregationRules = aggregationRules[aggregatedField];

    groupAggregationLookup[aggregatedField] = {
      position,
      value: getAggregationCellValue({
        apiRef,
        groupId,
        field: aggregatedField,
        aggregationFunction: columnAggregationRules.aggregationFunction,
        aggregationRowsScope,
      }),
    };
  }

  return groupAggregationLookup;
};

export const createAggregationLookup = ({
  apiRef,
  aggregationFunctions,
  aggregationRowsScope,
  getAggregationPosition,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregationFunctions: Record<string, GridAggregationFunction>;
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'];
  getAggregationPosition: DataGridPremiumProcessedProps['getAggregationPosition'];
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
    for (let i = 0; i < groupNode.children.length; i += 1) {
      const childId = groupNode.children[i];
      const childNode = rowTree[childId] as GridGroupNode | GridLeafNode;

      if (childNode.type === 'group') {
        createGroupAggregationLookup(childNode);
      }
    }

    const hasAggregableChildren = groupNode.children.length;
    if (hasAggregableChildren) {
      const position = getAggregationPosition(groupNode);
      if (position != null) {
        aggregationLookup[groupNode.id] = getGroupAggregatedValue({
          groupId: groupNode.id,
          apiRef,
          aggregatedFields,
          aggregationRowsScope,
          aggregationRules,
          position,
        });
      }
    }
  };

  createGroupAggregationLookup(rowTree[GRID_ROOT_GROUP_ID] as GridGroupNode);

  return aggregationLookup;
};
