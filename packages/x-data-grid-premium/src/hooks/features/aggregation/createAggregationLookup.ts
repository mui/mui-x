import { RefObject } from '@mui/x-internals/types';
import {
  gridColumnLookupSelector,
  GridRowId,
  GridGroupNode,
  GridLeafNode,
  gridRowTreeSelector,
  GRID_ROOT_GROUP_ID,
  gridRowsLookupSelector,
} from '@mui/x-data-grid-pro';
import { GridApiPremium, GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  GridAggregationFunction,
  GridAggregationFunctionDataSource,
  GridAggregationLookup,
  GridAggregationPosition,
  GridAggregationRules,
} from './gridAggregationInterfaces';
import { getAggregationRules } from './gridAggregationUtils';
import { gridAggregationModelSelector } from './gridAggregationSelectors';

type AggregatedValues = { aggregatedField: string; values: any[] }[];

export const shouldApplySorting = (
  aggregationRules: GridAggregationRules,
  aggregatedFields: string[],
) => {
  return aggregatedFields.some((field) => aggregationRules[field].aggregationFunction.applySorting);
};

const getGroupAggregatedValue = (
  groupId: GridRowId,
  apiRef: RefObject<GridPrivateApiPremium>,
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'],
  aggregatedFields: string[],
  aggregationRules: GridAggregationRules,
  position: GridAggregationPosition,
  applySorting: boolean,
  valueGetters: Record<string, (row: any) => any>,
  publicApi: GridApiPremium,
  rootAggregatedValues: AggregatedValues,
) => {
  const groupAggregationLookup: GridAggregationLookup[GridRowId] = {};
  const aggregatedValues: AggregatedValues = [];
  for (let i = 0; i < aggregatedFields.length; i += 1) {
    aggregatedValues[i] = {
      aggregatedField: aggregatedFields[i],
      values: [],
    };
  }

  const rowTree = gridRowTreeSelector(apiRef);
  const rowLookup = gridRowsLookupSelector(apiRef);
  const isPivotActive = apiRef.current.state.pivoting.active;

  const rowIds =
    // If the pivot is active, we only have group children for the root group, hence we can skip a recursion
    isPivotActive && groupId === GRID_ROOT_GROUP_ID
      ? []
      : apiRef.current.getRowGroupChildren({
          groupId,
          applySorting,
          directChildrenOnly: groupId === GRID_ROOT_GROUP_ID,
          applyFiltering: aggregationRowsScope === 'filtered',
        });

  for (let i = 0; i < rowIds.length; i += 1) {
    const rowId = rowIds[i];

    // If the row is a group, we want to aggregate based on its children
    // For instance in the following tree, we want the aggregated values of A to be based on A.A, A.B.A and A.B.B but not A.B
    // A
    //   A.A
    //   A.B
    //     A.B.A
    //     A.B.B

    const rowNode = rowTree[rowId];
    if (rowNode.type === 'group') {
      continue;
    }
    const row = rowLookup[rowId];

    for (let j = 0; j < aggregatedFields.length; j += 1) {
      const aggregatedField = aggregatedFields[j];
      const columnAggregationRules = aggregationRules[aggregatedField];

      const aggregationFunction =
        columnAggregationRules.aggregationFunction as GridAggregationFunction;
      const field = aggregatedField;

      let value;
      if (typeof aggregationFunction.getCellValue === 'function') {
        value = aggregationFunction.getCellValue({ field, row });
      } else if (isPivotActive) {
        // Since we know that pivoted fields are flat, we can use the row directly, and save lots of processing time
        value = row[field];
      } else {
        const valueGetter = valueGetters[aggregatedField]!;
        value = valueGetter(row);
      }

      aggregatedValues[j].values.push(value);
      rootAggregatedValues[j].values.push(value);
    }
  }

  const groupValues = groupId === GRID_ROOT_GROUP_ID ? rootAggregatedValues : aggregatedValues;
  for (let i = 0; i < groupValues.length; i += 1) {
    const { aggregatedField, values } = groupValues[i];
    const aggregationFunction = aggregationRules[aggregatedField]
      .aggregationFunction as GridAggregationFunction;
    const value = aggregationFunction.apply(
      {
        values,
        groupId,
        field: aggregatedField, // Added per user request in https://github.com/mui/mui-x/issues/6995#issuecomment-1327423455
      },
      publicApi,
    );

    groupAggregationLookup[aggregatedField] = {
      position,
      value,
    };
  }

  return groupAggregationLookup;
};

const getGroupAggregatedValueDataSource = (
  groupId: GridRowId,
  apiRef: RefObject<GridPrivateApiPremium>,
  aggregatedFields: string[],
  position: GridAggregationPosition,
) => {
  const groupAggregationLookup: GridAggregationLookup[GridRowId] = {};

  for (let j = 0; j < aggregatedFields.length; j += 1) {
    const aggregatedField = aggregatedFields[j];

    groupAggregationLookup[aggregatedField] = {
      position,
      value: apiRef.current.resolveGroupAggregation?.(groupId, aggregatedField) ?? '',
    };
  }

  return groupAggregationLookup;
};

export const createAggregationLookup = ({
  apiRef,
  aggregationFunctions,
  aggregationRowsScope,
  getAggregationPosition,
  isDataSource,
}: {
  apiRef: RefObject<GridPrivateApiPremium>;
  aggregationFunctions:
    | Record<string, GridAggregationFunction>
    | Record<string, GridAggregationFunctionDataSource>;
  aggregationRowsScope: DataGridPremiumProcessedProps['aggregationRowsScope'];
  getAggregationPosition: DataGridPremiumProcessedProps['getAggregationPosition'];
  isDataSource: boolean;
}): GridAggregationLookup => {
  const aggregationRules = getAggregationRules(
    gridColumnLookupSelector(apiRef),
    gridAggregationModelSelector(apiRef),
    aggregationFunctions,
    isDataSource,
  );

  const aggregatedFields = Object.keys(aggregationRules);
  if (aggregatedFields.length === 0) {
    return {};
  }

  const columnsLookup = gridColumnLookupSelector(apiRef);
  const valueGetters = {} as Record<string, (row: any) => any>;
  for (let i = 0; i < aggregatedFields.length; i += 1) {
    const field = aggregatedFields[i];
    const column = columnsLookup[field];
    const valueGetter = (row: any) => apiRef.current.getRowValue(row, column);
    valueGetters[field] = valueGetter;
  }

  const applySorting = shouldApplySorting(aggregationRules, aggregatedFields);

  const aggregationLookup: GridAggregationLookup = {};
  const rowTree = gridRowTreeSelector(apiRef);

  const rootAggregatedValues: AggregatedValues = Array.from({
    length: aggregatedFields.length,
  }).map((_, index) => ({
    aggregatedField: aggregatedFields[index],
    values: [],
  }));
  const createGroupAggregationLookup = (groupNode: GridGroupNode) => {
    for (let i = 0; i < groupNode.children.length; i += 1) {
      const childId = groupNode.children[i];
      const childNode = rowTree[childId] as GridGroupNode | GridLeafNode;

      if (childNode.type === 'group') {
        createGroupAggregationLookup(childNode);
      }
    }

    const position = getAggregationPosition(groupNode);

    if (position !== null) {
      if (isDataSource) {
        aggregationLookup[groupNode.id] = getGroupAggregatedValueDataSource(
          groupNode.id,
          apiRef,
          aggregatedFields,
          position,
        );
      } else if (groupNode.children.length) {
        aggregationLookup[groupNode.id] = getGroupAggregatedValue(
          groupNode.id,
          apiRef,
          aggregationRowsScope,
          aggregatedFields,
          aggregationRules,
          position,
          applySorting,
          valueGetters,
          apiRef.current,
          rootAggregatedValues,
        );
      }
    }
  };

  createGroupAggregationLookup(rowTree[GRID_ROOT_GROUP_ID] as GridGroupNode);

  return aggregationLookup;
};
