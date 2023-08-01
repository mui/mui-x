import * as React from 'react';
import { GridColDef, GridRowModel } from '@mui/x-data-grid-pro';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridAggregationModel } from '../aggregation';

interface PivotModel {
  columns: GridColDef['field'][];
  rows: GridColDef['field'][];
  value: GridColDef['field'];
  aggFunc: string;
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

  const valueField = pivotModel.value;
  const newRows: GridRowModel[] = [];
  rows.forEach((row) => {
    const newRow = { ...row };
    pivotModel.columns.forEach((field) => {
      const colValue = row[field];
      const mapKey = `${field}-${colValue}`;
      if (!pivotColumns.has(mapKey)) {
        pivotColumns.set(mapKey, {
          field: colValue,
          aggregable: true,
          availableAggregationFunctions: [pivotModel.aggFunc],
        });
        aggregationModel[colValue] = pivotModel.aggFunc;
      }
      delete newRow[field];
      newRow[colValue] = newRow[valueField];
    });

    newRows.push(newRow);
  });

  return {
    rows: newRows,
    columns: Array.from(pivotColumns, ([, value]) => value),
    rowGroupingModel: pivotModel.rows,
    aggregationModel,
    getAggregationPosition: () => 'inline',
    columnVisibilityModel,
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
