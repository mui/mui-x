import * as React from 'react';
import { GridColDef, GridColumnGroupingModel, GridRowModel } from '@mui/x-data-grid-pro';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationModel } from '../aggregation';

interface PivotModel {
  columns: GridColDef['field'][];
  rows: GridColDef['field'][];
  values: {
    field: GridColDef['field'];
    aggFunc: string;
  }[];
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
  const pivotColumns: Map<string, GridColDef> = new Map();
  const columnVisibilityModel: DataGridPremiumProcessedProps['columnVisibilityModel'] = {};

  pivotModel.rows.forEach((field) => {
    pivotColumns.set(field, {
      field,
      groupable: true,
    });
    columnVisibilityModel[field] = false;
  });

  const aggregationModel: GridAggregationModel = {};

  const columnGroupingModel: GridColumnGroupingModel = [];

  const newRows: GridRowModel[] = [];
  rows.forEach((row) => {
    const newRow = { ...row };
    if (pivotModel.values.length === 1) {
      const pivotValue = pivotModel.values[0];
      pivotModel.columns.forEach((field) => {
        const colValue = row[field];
        const mapKey = `${field}-${colValue}`;
        if (!pivotColumns.has(mapKey)) {
          pivotColumns.set(mapKey, {
            field: colValue,
            aggregable: true,
            availableAggregationFunctions: [pivotValue.aggFunc],
          });
          aggregationModel[colValue] = pivotValue.aggFunc;
        }
        delete newRow[field];
        newRow[colValue] = newRow[pivotValue.field];
      });
    } else {
      pivotModel.columns.forEach((colGroupField) => {
        const colValue = row[colGroupField];
        const mapKey = `${colGroupField}-${colValue}`;

        const columnGroup: GridColumnGroupingModel[number] = {
          groupId: mapKey,
          headerName: colValue,
          children: [],
        };

        if (!pivotColumns.has(mapKey)) {
          columnGroupingModel.push(columnGroup);

          pivotModel.values.forEach((pivotValue) => {
            const valueField = pivotValue.field;
            const mapValueKey = `${mapKey}-${valueField}`;
            pivotColumns.set(mapValueKey, {
              field: mapValueKey,
              headerName: valueField,
              aggregable: true,
              availableAggregationFunctions: [pivotValue.aggFunc],
            });
            aggregationModel[mapValueKey] = pivotValue.aggFunc;
            columnGroup.children.push({ field: mapValueKey });
            newRow[mapValueKey] = newRow[valueField];
            delete newRow[valueField];
          });
        }
      });
    }

    newRows.push(newRow);
  });

  return {
    rows: newRows,
    columns: Array.from(pivotColumns, ([, value]) => value),
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
