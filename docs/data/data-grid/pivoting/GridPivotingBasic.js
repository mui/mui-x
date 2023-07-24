import * as React from 'react';
import { DataGridPremium, useGridApiRef } from '@mui/x-data-grid-premium';

const initialRows = [
  { id: 1, product: 'Product 1', type: 'Type A', price: 10 },
  { id: 2, product: 'Product 2', type: 'Type A', price: 12 },
  { id: 3, product: 'Product 3', type: 'Type B', price: 8 },
  { id: 4, product: 'Product 4', type: 'Type C', price: 20 },
];

const initialColumns = [{ field: 'product' }, { field: 'type' }, { field: 'price' }];

const getPivotedData = ({
  rows,
  // columns,
  pivotModel,
}) => {
  const pivotColumns = new Map();
  const columnVisibilityModel = {};

  pivotModel.rows.forEach((field) => {
    pivotColumns.set(field, {
      field,
      groupable: true,
    });
    columnVisibilityModel[field] = false;
  });

  const aggregationModel = {};

  const valueField = pivotModel.value;
  const newRows = [];
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

const useGridPivoting = ({ columns, rows, pivotModel }) => {
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
