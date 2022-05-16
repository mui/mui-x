import * as React from 'react';
import {
  gridColumnLookupSelector,
  gridFilteredRowsLookupSelector,
  GridRowId,
  gridRowIdsSelector,
  GridRowTreeConfig,
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

const getNonAutoGeneratedDescendants = (tree: GridRowTreeConfig, parentId: GridRowId) => {
  const children = tree[parentId].children;
  if (children == null) {
    return [];
  }

  const validDescendants: GridRowId[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const childNode = tree[child];
    if (!childNode.isAutoGenerated) {
      validDescendants.push(child);
    }
    validDescendants.push(...getNonAutoGeneratedDescendants(tree, childNode.id));
  }

  return validDescendants;
};

const getAggregationCellValue = ({
  apiRef,
  id,
  field,
  aggregationFunction,
  aggregatedRows,
}: {
  apiRef: React.MutableRefObject<GridApiPremium>;
  id: GridRowId;
  field: string;
  aggregationFunction: GridAggregationFunction;
  aggregatedRows: DataGridPremiumProcessedProps['aggregatedRows'];
}) => {
  const rowTree = gridRowTreeSelector(apiRef);
  const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);

  let rowIds: GridRowId[];

  // TODO: Add custom root id
  if (id === '') {
    rowIds = gridRowIdsSelector(apiRef).filter((rowId) => !rowTree[rowId].isAutoGenerated);
  } else {
    rowIds = getNonAutoGeneratedDescendants(rowTree, id);
  }

  if (aggregatedRows === 'filtered') {
    rowIds = rowIds.filter((rowId) => filteredRowsLookup[rowId] !== false);
  }

  return aggregationFunction.apply({
    values: rowIds.map((rowId) => apiRef.current.getCellValue(rowId, field)),
  });
};

const getGroupAggregatedValue = ({
  id,
  apiRef,
  aggregatedRows,
  aggregatedFields,
  aggregationRules,
  isGroupAggregated,
}: {
  id: GridRowId;
  apiRef: React.MutableRefObject<GridApiPremium>;
  aggregatedRows: DataGridPremiumProcessedProps['aggregatedRows'];
  aggregatedFields: string[];
  aggregationRules: GridAggregationRules;
  isGroupAggregated: DataGridPremiumProcessedProps['isGroupAggregated'];
}) => {
  const groupAggregationLookup: GridAggregationLookup[GridRowId] = {};
  const rowNode = apiRef.current.getRowNode(id)!;

  for (let j = 0; j < aggregatedFields.length; j += 1) {
    const aggregatedField = aggregatedFields[j];
    const columnAggregationRules = aggregationRules[aggregatedField];
    const columnAggregationLookup: GridAggregationLookup[GridRowId][string] = {};

    if (
      columnAggregationRules.inline &&
      (!isGroupAggregated || isGroupAggregated(rowNode, 'inline'))
    ) {
      columnAggregationLookup.inline = getAggregationCellValue({
        apiRef,
        id,
        field: aggregatedField,
        aggregationFunction: columnAggregationRules.inline.aggregationFunction,
        aggregatedRows,
      });
    }

    if (
      columnAggregationRules.footer &&
      (!isGroupAggregated || isGroupAggregated(rowNode, 'footer'))
    ) {
      columnAggregationLookup.footer = getAggregationCellValue({
        apiRef,
        id,
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
  const rowIds = gridRowIdsSelector(apiRef);
  const rowTree = gridRowTreeSelector(apiRef);

  for (let i = 0; i < rowIds.length; i += 1) {
    const rowId = rowIds[i];
    const hasChildren = rowTree[rowId].children?.some(
      (childId) => (rowTree[childId].position ?? 'body') === 'body',
    );

    if (hasChildren) {
      aggregationLookup[rowId] = getGroupAggregatedValue({
        id: rowId,
        apiRef,
        aggregatedFields,
        aggregatedRows,
        aggregationRules,
        isGroupAggregated,
      });
    }
  }

  // TODO: Add custom root id
  aggregationLookup[''] = getGroupAggregatedValue({
    id: '',
    apiRef,
    aggregatedFields,
    aggregatedRows,
    aggregationRules,
    isGroupAggregated,
  });

  return aggregationLookup;
};
