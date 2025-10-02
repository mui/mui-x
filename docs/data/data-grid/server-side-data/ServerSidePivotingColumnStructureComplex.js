import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

const columns = [
  { field: 'id' },
  { field: 'group', headerName: 'Group' },
  { field: 'region' },
  { field: 'date' },
  {
    field: 'year',
    valueGetter: (value, row) => new Date(row.date).getFullYear(),
  },
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
  field: columnGroupPath.concat(originalColumnField).join('>->'),
});

const pivotColumns = [
  {
    key: 'A15',
    group: 'A15',
    children: [
      { key: '2024', group: { date: '2024-01-01' } },
      { key: '2025', group: { date: '2025-01-01' } },
      { key: '2026', group: { date: '2026-01-01' } },
    ],
  },
  {
    key: 'C11',
    group: 'C11',
    children: [
      { key: '2024', group: { date: '2024-01-01' } },
      { key: '2025', group: { date: '2025-01-01' } },
    ],
  },
];

const rows = [
  {
    id: 1,
    group: 'A',
    'A15>->2024>->quantity': 100,
    'A15>->2025>->quantity': 200,
    'A15>->2026>->quantity': 200,
    'C11>->2024>->quantity': 150,
    'C11>->2025>->quantity': 300,
    descendantCount: 2,
  },
  {
    id: 2,
    group: 'B',
    'A15>->2024>->quantity': 100,
    'A15>->2025>->quantity': 200,
    'C11>->2024>->quantity': 150,
    'C11>->2025>->quantity': 300,
    descendantCount: 1,
  },
  {
    id: 3,
    group: 'C',
    'A15>->2024>->quantity': 100,
    'A15>->2025>->quantity': 200,
    'C11>->2024>->quantity': 150,
    'C11>->2025>->quantity': 300,
    descendantCount: 3,
  },
  {
    id: 4,
    group: 'D',
    'A15>->2024>->quantity': 100,
    'A15>->2025>->quantity': 200,
    'A15>->2026>->quantity': 200,
    'C11>->2024>->quantity': 150,
    'C11>->2025>->quantity': 300,
    descendantCount: 4,
  },
  {
    id: 5,
    group: 'E',
    'A15>->2024>->quantity': 100,
    'A15>->2025>->quantity': 200,
    'C11>->2024>->quantity': 150,
    'C11>->2025>->quantity': 300,
    descendantCount: 2,
  },
];

export default function ServerSidePivotingColumnStructureComplex() {
  const dataSource = React.useMemo(
    () => ({
      getRows: async () => {
        return {
          rows,
          rowCount: rows.length,
          aggregateRow: {
            'A15>->2024>->quantity': 500,
            'A15>->2025>->quantity': 1000,
            'A15>->2026>->quantity': 400,
            'C11>->2024>->quantity': 750,
            'C11>->2025>->quantity': 1500,
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
