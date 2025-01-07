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
  const aggregatedValues: { aggregatedField: string; values: any[] }[] = [];

  const rowIds = apiRef.current.getRowGroupChildren({ groupId });
  const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);

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

    const row = apiRef.current.getRow(rowId);

    for (let j = 0; j < aggregatedFields.length; j += 1) {
      const aggregatedField = aggregatedFields[j];
      const columnAggregationRules = aggregationRules[aggregatedField];

      const aggregationFunction = columnAggregationRules.aggregationFunction;
      const field = aggregatedField;

      if (aggregatedValues[j] === undefined) {
        aggregatedValues[j] = {
          aggregatedField,
          values: [],
        };
      }

      if (typeof aggregationFunction.getCellValue === 'function') {
        aggregatedValues[j].values.push(aggregationFunction.getCellValue({ row }));
      } else {
        const colDef = apiRef.current.getColumn(field);
        aggregatedValues[j].values.push(apiRef.current.getRowValue(row, colDef));
      }
    }
  });

  for (let i = 0; i < aggregatedValues.length; i += 1) {
    const { aggregatedField, values } = aggregatedValues[i];
    const aggregationFunction = aggregationRules[aggregatedField].aggregationFunction;
    const value = aggregationFunction.apply({
      values,
      groupId,
      field: aggregatedField, // Added per user request in https://github.com/mui/mui-x/issues/6995#issuecomment-1327423455
    });

    groupAggregationLookup[aggregatedField] = {
      position,
      value,
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
