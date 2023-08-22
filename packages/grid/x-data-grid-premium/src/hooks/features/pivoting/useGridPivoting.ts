import * as React from 'react';
import {
  GridColDef,
  GridColumnGroup,
  GridColumnGroupingModel,
  GridColumnNode,
  GridRowModel,
  gridStringOrNumberComparator,
  isLeaf,
} from '@mui/x-data-grid-pro';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationModel } from '../aggregation';

export interface PivotModel {
  columns: GridColDef['field'][];
  rows: GridColDef['field'][];
  values: {
    field: GridColDef['field'];
    aggFunc: string;
  }[];
}

function getFieldValue(row: GridRowModel, field: GridColDef['field']) {
  // TODO: valueGetter
  return row[field];
}

function sortColumnGroups(columnGroups: GridColumnNode[]) {
  columnGroups.sort((a, b) => {
    if (isLeaf(a) || isLeaf(b)) {
      return 0;
    }
    if (a.children) {
      sortColumnGroups(a.children);
    }
    return gridStringOrNumberComparator(a.headerName, b.headerName, {} as any, {} as any);
  });
}

const getPivotedData = ({
  rows,
  // columns,
  pivotModel,
}: {
  rows: GridRowModel[];
  columns: GridColDef[];
  pivotModel: PivotModel;
}): {
  rows: DataGridPremiumProcessedProps['rows'];
  columns: DataGridPremiumProcessedProps['columns'];
  rowGroupingModel: NonNullable<DataGridPremiumProcessedProps['rowGroupingModel']>;
  aggregationModel: NonNullable<DataGridPremiumProcessedProps['aggregationModel']>;
  getAggregationPosition: NonNullable<DataGridPremiumProcessedProps['getAggregationPosition']>;
  columnVisibilityModel: NonNullable<DataGridPremiumProcessedProps['columnVisibilityModel']>;
  columnGroupingModel: NonNullable<DataGridPremiumProcessedProps['columnGroupingModel']>;
} => {
  const pivotColumns: GridColDef[] = [];
  const columnVisibilityModel: DataGridPremiumProcessedProps['columnVisibilityModel'] = {};

  pivotModel.rows.forEach((field) => {
    pivotColumns.push({
      field,
      groupable: true,
    });
    columnVisibilityModel[field] = false;
  });

  const aggregationModel: GridAggregationModel = {};

  const columnGroupingModel: GridColumnGroupingModel = [];
  // Use lookup for faster access to column groups
  const columnGroupingModelLookup: Record<string, GridColumnGroup> = {};

  let newRows: GridRowModel[] = [];

  if (pivotModel.columns.length === 0) {
    newRows = rows;

    pivotModel.values.forEach((pivotValue) => {
      pivotColumns.push({
        field: pivotValue.field,
        aggregable: true,
        availableAggregationFunctions: [pivotValue.aggFunc],
      });
      aggregationModel[pivotValue.field] = pivotValue.aggFunc;
    });
  } else {
    rows.forEach((row) => {
      const newRow = { ...row };
      const columnGroupPath: string[] = [];

      pivotModel.columns.forEach((colGroupField, depth) => {
        const colValue = getFieldValue(row, colGroupField) || '(No value)';
        columnGroupPath.push(String(colValue));
        const groupId = columnGroupPath.join('-');

        if (!columnGroupingModelLookup[groupId]) {
          const columnGroup: GridColumnGroupingModel[number] = {
            groupId,
            headerName: colValue,
            children: [],
          };
          columnGroupingModelLookup[groupId] = columnGroup;
          if (depth === 0) {
            columnGroupingModel.push(columnGroup);
          } else {
            const parentGroupId = columnGroupPath.slice(0, -1).join('-');
            const parentGroup = columnGroupingModelLookup[parentGroupId];
            parentGroup.children.push(columnGroup);
          }

          const isLastColumnGroupLevel = depth === pivotModel.columns.length - 1;

          if (isLastColumnGroupLevel) {
            pivotModel.values.forEach((pivotValue) => {
              const valueField = pivotValue.field;
              const valueKey = `${columnGroupPath.join('-')}-${valueField}`;
              newRow[valueKey] = newRow[valueField];
              delete newRow[valueField];
            });
          }
        }
      });

      newRows.push(newRow);
    });
  }

  sortColumnGroups(columnGroupingModel);

  function createColumns(columnGroups: GridColumnNode[], depth = 0) {
    columnGroups.forEach((columnGroup) => {
      if (isLeaf(columnGroup)) {
        return;
      }
      const isLastColumnGroupLevel = depth === pivotModel.columns.length - 1;
      if (isLastColumnGroupLevel) {
        pivotModel.values.forEach((pivotValue) => {
          const valueField = pivotValue.field;
          const mapValueKey = `${columnGroup.groupId}-${valueField}`;
          pivotColumns.push({
            field: mapValueKey,
            headerName: String(valueField),
            aggregable: true,
            availableAggregationFunctions: [pivotValue.aggFunc],
          });
          aggregationModel[mapValueKey] = pivotValue.aggFunc;
          if (columnGroup) {
            columnGroup.children.push({ field: mapValueKey });
          }
        });
      } else {
        createColumns(columnGroup.children, depth + 1);
      }
    });
  }

  createColumns(columnGroupingModel);

  return {
    rows: newRows,
    columns: pivotColumns,
    rowGroupingModel: pivotModel.rows,
    aggregationModel,
    getAggregationPosition: () => 'inline',
    columnVisibilityModel,
    columnGroupingModel,
  };
};

export const useGridPivoting = ({
  columns,
  rows,
  pivotModel,
}: {
  rows: GridRowModel[];
  columns: GridColDef[];
  pivotModel: PivotModel;
}) => {
  const [isPivot, setIsPivot] = React.useState(false);

  const props = React.useMemo(() => {
    if (isPivot) {
      return getPivotedData({
        rows,
        columns,
        pivotModel,
      });
    }
    return { rows, columns };
  }, [isPivot, columns, rows, pivotModel]);

  return {
    isPivot,
    setIsPivot,
    props,
  };
};
