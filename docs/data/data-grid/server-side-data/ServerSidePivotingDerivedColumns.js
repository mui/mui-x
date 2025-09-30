import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const derivedColumns = [];
const getYearField = (field) => `${field}-year`;
const getMonthField = (field) => `${field}-month`;
const getPivotDerivedColumns = (column) => {
  const field = column.field;
  if (field === 'maturityDate') {
    const yearField = {
      field: getYearField(field),
      headerName: `${column.headerName} (Year)`,
      valueGetter: (value) => new Date(value).getFullYear(),
    };
    const monthField = {
      field: getMonthField(field),
      headerName: `${column.headerName} (Month)`,
      type: 'number',
      valueGetter: (value) => new Date(value).getMonth(),
      valueFormatter: (month) =>
        new Date(0, month).toLocaleString(undefined, { month: 'long' }),
    };
    derivedColumns.push(yearField);
    derivedColumns.push(monthField);
    return [yearField, monthField];
  }
  return undefined;
};

const pivotModel = {
  rows: [{ field: 'commodity' }],
  columns: [
    { field: getYearField('maturityDate'), sort: 'desc' },
    { field: getMonthField('maturityDate'), sort: 'desc' },
  ],
  values: [{ field: 'quantity', aggFunc: 'sum' }],
};

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function ServerSidePivotingDerivedColumns() {
  const {
    columns,
    initialState: initialStateMock,
    fetchRows,
  } = useMockServer({
    rowLength: 2000,
    dataSet: 'Commodity',
    maxColumns: 20,
    derivedColumns: true,
  });

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
          pivotModel: JSON.stringify(params.pivotModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
          pivotColumns: getRowsResponse.pivotColumns,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[field],
      getPivotColumnDef: (field, columnGroupPath) => ({
        ...(derivedColumns.find((col) => col.field === field) || {}),
        field: columnGroupPath
          .map((path) =>
            typeof path.value === 'string' ? path.value : path.value[path.field],
          )
          .concat(field)
          .join('>->'),
      }),
    }),
    [fetchRows],
  );

  const initialState = React.useMemo(
    () => ({
      ...initialStateMock,
      pivoting: {
        model: pivotModel,
        enabled: true,
      },
      pagination: { paginationModel: { pageSize: 10, page: 0 } },
    }),
    [initialStateMock],
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        showToolbar
        pagination
        pageSizeOptions={[10, 20, 50]}
        initialState={initialState}
        aggregationFunctions={aggregationFunctions}
        getPivotDerivedColumns={getPivotDerivedColumns}
      />
    </div>
  );
}
