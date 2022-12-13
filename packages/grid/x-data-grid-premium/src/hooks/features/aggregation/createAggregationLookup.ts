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
  const rowIds: GridRowId[] = apiRef.current.getRowGroupChildren({ groupId });

  const values: any[] = [];
  rowIds.forEach((rowId) => {
    if (aggregationRowsScope === 'filtered' && filteredRowsLookup[rowId] === false) {
      return;
    }

    // If the row is a group, we want to aggregate based on its children
    // For instance in the following tree, we want the aggregated values of A to be based on A.A, A.B.A and A.B.B but not A.B
    // A
    //   A.A
    //   A.B
    //     A.B.A
    //     A.B.B
    const rowNode = apiRef.current.getRowNode(rowId)!;
    if (rowNode.type === 'group') {
      return;
    }

    if (typeof aggregationFunction.getCellValue === 'function') {
      const row = apiRef.current.getRow(rowId);
      values.push(aggregationFunction.getCellValue({ row }));
    } else {
      values.push(apiRef.current.getCellValue(rowId, field));
    }
  });

  return aggregationFunction.apply({
    values,
    groupId,
    field, // Added per user request in https://github.com/mui/mui-x/issues/6995#issuecomment-1327423455
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
