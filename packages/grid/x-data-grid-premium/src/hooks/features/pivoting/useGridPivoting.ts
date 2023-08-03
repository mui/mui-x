import * as React from 'react';
import { GridColDef, GridColumnGroupingModel, GridRowModel } from '@mui/x-data-grid-pro';
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

  const columnGroupingModel: Map<string, GridColumnGroupingModel[number]> = new Map();

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
      pivotModel.columns.forEach((colGroupField) => {
        const colValue = getFieldValue(row, colGroupField);
        const mapKey = `${colGroupField}-${colValue}`;

        let columnGroup: GridColumnGroupingModel[number];

        if (!columnGroupingModel.has(mapKey)) {
          columnGroup = {
            groupId: mapKey,
            headerName: String(colValue),
            children: [],
          };

          columnGroupingModel.set(mapKey, columnGroup);

          pivotModel.values.forEach((pivotValue) => {
            const valueField = pivotValue.field;
            const mapValueKey = `${mapKey}-${valueField}`;
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
            newRow[mapValueKey] = newRow[valueField];
            delete newRow[valueField];
          });
        }
      });

      newRows.push(newRow);
    });
  }

  return {
    rows: newRows,
    columns: pivotColumns,
    rowGroupingModel: pivotModel.rows,
    aggregationModel,
    getAggregationPosition: () => 'inline',
    columnVisibilityModel,
    columnGroupingModel: Array.from(columnGroupingModel, ([, value]) => value),
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
