import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
} from '@mui/x-data-grid-premium';
import Button from '@mui/material/Button';

const rows = [
  {
    id: 1,
    product: 'Apples',
    region: 'North',
    quarter: 'Q1',
    sales: 1000,
    profit: 100,
    size: 'L',
  },
  {
    id: 2,
    product: 'Apples',
    region: 'South',
    quarter: 'Q1',
    sales: 1200,
    profit: 120,
    size: 'M',
  },
  {
    id: 3,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q1',
    sales: 800,
    profit: 80,
    size: 'M',
  },
  {
    id: 4,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q1',
    sales: 900,
    profit: 90,
    size: 'S',
  },
  {
    id: 5,
    product: 'Apples',
    region: 'North',
    quarter: 'Q2',
    sales: 1100,
    profit: 110,
    size: 'L',
  },
  {
    id: 6,
    product: 'Apples',
    region: 'South',
    quarter: 'Q2',
    sales: 1300,
    profit: 130,
    size: 'L',
  },
  {
    id: 7,
    product: 'Oranges',
    region: 'North',
    quarter: 'Q2',
    sales: 850,
    profit: 85,
    size: 'M',
  },
  {
    id: 8,
    product: 'Oranges',
    region: 'South',
    quarter: 'Q2',
    sales: 950,
    profit: 95,
    size: 'S',
  },
];

const pivotModel = {
  rows: [{ field: 'product' }, { field: 'size' }],
  columns: [{ field: 'region' }, { field: 'quarter' }],
  values: [
    { field: 'sales', aggFunc: 'sum' },
    { field: 'profit', aggFunc: 'avg' },
  ],
};

export default function ColumnSizingPersistWidthPivoting() {
  const apiRef = useGridApiRef();
  const [index, setIndex] = React.useState(0);
  const inputColumns = React.useMemo(
    () => [
      { field: 'product', headerName: 'Product' },
      { field: 'region', headerName: 'Region' },
      { field: 'quarter', headerName: 'Quarter' },
      {
        field: 'sales',
        headerName: 'Sales',
        type: 'number',
      },
      {
        field: 'profit',
        headerName: 'Profit',
        type: 'number',
        valueFormatter: (value) => {
          if (!value) {
            return '';
          }
          return `${value}%`;
        },
      },
      {
        field: 'size',
        headerName: 'Size',
      },
    ],
    [index],
  );

  const columnsState = useColumnsState(inputColumns);

  const pivotingColDef = React.useCallback(
    (field, group) => {
      const pivotingField = [...group, field].join('>->');
      const fieldWidth = columnsState.getColumnWidth(pivotingField);
      return fieldWidth ? { width: fieldWidth } : {};
    },
    [columnsState],
  );

  const groupingColDef = React.useCallback(() => {
    const column = apiRef.current?.getColumn(
      GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
    );
    return column?.width ? { width: column.width } : {};
  }, [apiRef]);

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => setIndex((prev) => prev + 1)}>
        Update columns reference
      </Button>
      <div style={{ height: 450 }}>
        <DataGridPremium
          apiRef={apiRef}
          columns={columnsState.columns}
          onColumnWidthChange={columnsState.onColumnWidthChange}
          rows={rows}
          initialState={{
            pivoting: {
              enabled: true,
              model: pivotModel,
            },
          }}
          pivotingColDef={pivotingColDef}
          groupingColDef={groupingColDef}
        />
      </div>
    </div>
  );
}

const useColumnsState = (columns) => {
  const [widths, setWidths] = React.useState({});

  const onColumnWidthChange = React.useCallback(
    ({ colDef, width }) => {
      setWidths((prev) => ({ ...prev, [colDef.field]: width }));
    },
    [setWidths],
  );

  const getColumnWidth = React.useCallback((field) => widths[field], [widths]);

  const computedColumns = React.useMemo(
    () =>
      columns.reduce((acc, column) => {
        if (widths[column.field]) {
          acc.push({
            ...column,
            width: widths[column.field],
          });
          return acc;
        }
        acc.push(column);
        return acc;
      }, []),
    [columns, widths],
  );

  return {
    columns: computedColumns,
    getColumnWidth,
    onColumnWidthChange,
  };
};
