import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const columns = [
  { field: 'id' },
  { field: 'group', headerName: 'Group' },
  { field: 'region' },
  { field: 'year' },
  { field: 'quantity', headerName: 'Quantity', type: 'number' },
];

const pivotModel = {
  rows: [{ field: 'group' }],
  columns: [{ field: 'region' }, { field: 'year' }],
  values: [{ field: 'quantity', aggFunc: 'sum' }],
};

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

const pivotingColDef = (originalColumnField, columnGroupPath) => ({
  field: columnGroupPath.concat(originalColumnField).join('-'),
});

const pivotColumns = [
  {
    key: 'A15',
    group: 'A15',
    children: [
      { key: '24', group: '2024' },
      { key: '25', group: '2025' },
      { key: '26', group: '2026' },
    ],
  },
  {
    key: 'C11',
    group: 'C11',
    children: [
      { key: '24', group: '2024' },
      { key: '25', group: '2025' },
    ],
  },
];

const rows = [
  {
    id: 1,
    group: 'A',
    'A15-24-quantity': 100,
    'A15-25-quantity': 200,
    'A15-26-quantity': 200,
    'C11-24-quantity': 150,
    'C11-25-quantity': 300,
    descendantCount: 2,
  },
  {
    id: 2,
    group: 'B',
    'A15-24-quantity': 100,
    'A15-25-quantity': 200,
    'C11-24-quantity': 150,
    'C11-25-quantity': 300,
    descendantCount: 1,
  },
  {
    id: 3,
    group: 'C',
    'A15-24-quantity': 100,
    'A15-25-quantity': 200,
    'C11-24-quantity': 150,
    'C11-25-quantity': 300,
    descendantCount: 3,
  },
  {
    id: 4,
    group: 'D',
    'A15-24-quantity': 100,
    'A15-25-quantity': 200,
    'A15-26-quantity': 200,
    'C11-24-quantity': 150,
    'C11-25-quantity': 300,
    descendantCount: 4,
  },
  {
    id: 5,
    group: 'E',
    'A15-24-quantity': 100,
    'A15-25-quantity': 200,
    'C11-24-quantity': 150,
    'C11-25-quantity': 300,
    descendantCount: 2,
  },
];

export default function ServerSidePivotingColumnStructureSimple() {
  const dataSource = React.useMemo(
    () => ({
      getRows: async () => {
        return {
          rows,
          rowCount: rows.length,
          aggregateRow: {
            'A15-24-quantity': 500,
            'A15-25-quantity': 1000,
            'A15-26-quantity': 400,
            'C11-24-quantity': 750,
            'C11-25-quantity': 1500,
          },
          pivotColumns,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[field],
    }),
    [],
  );

  return (
    <div style={{ height: 442, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        hideFooter
        columnGroupHeaderHeight={36}
        pivotActive
        pivotModel={pivotModel}
        pivotingColDef={pivotingColDef}
        aggregationFunctions={aggregationFunctions}
        disableColumnMenu
        disableColumnSorting
        disableColumnFilter
        disableColumnPinning
      />
    </div>
  );
}
