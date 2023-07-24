import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridColDef,
  GridRowModel,
  GridAggregationModel,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';

const initialRows: GridRowModel[] = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20 },
];

const initialColumns: GridColDef[] = [
  { field: 'product' },
  { field: 'type' },
  { field: 'price' },
];

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
  rows: DataGridPremiumProps['rows'];
  columns: DataGridPremiumProps['columns'];
  rowGroupingModel: NonNullable<DataGridPremiumProps['rowGroupingModel']>;
  aggregationModel: NonNullable<DataGridPremiumProps['aggregationModel']>;
  getAggregationPosition: NonNullable<
    DataGridPremiumProps['getAggregationPosition']
  >;
  columnVisibilityModel: NonNullable<DataGridPremiumProps['columnVisibilityModel']>;
} => {
  const pivotColumns: Map<string, GridColDef> = new Map();
  const columnVisibilityModel: DataGridPremiumProps['columnVisibilityModel'] = {};

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

const useGridPivoting = ({
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

export default function GridPivotingBasic() {
  const apiRef = useGridApiRef();

  const { isPivot, setIsPivot, props } = useGridPivoting({
    rows: initialRows,
    columns: initialColumns,
    pivotModel: {
      rows: ['type'],
      columns: ['product'],
      value: 'price',
      aggFunc: 'sum',
    },
  });

  return (
    <div style={{ width: '100%' }}>
      <input
        id="pivot"
        type="checkbox"
        checked={isPivot}
        onChange={(e) => setIsPivot(e.target.checked)}
      />
      <label htmlFor="pivot">Pivot</label>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium key={isPivot.toString()} {...props} apiRef={apiRef} />
      </div>
    </div>
  );
}
