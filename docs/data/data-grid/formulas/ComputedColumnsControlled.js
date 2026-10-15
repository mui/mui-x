import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import Typography from '@mui/material/Typography';

const columns = [
  { field: 'employee', headerName: 'Employee', width: 160 },
  { field: 'team', headerName: 'Team', width: 120 },
  {
    field: 'hourlyRate',
    headerName: 'Hourly rate',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'hours',
    headerName: 'Hours',
    type: 'number',
    width: 90,
    editable: true,
  },
  {
    field: 'overtimeHours',
    headerName: 'Overtime',
    type: 'number',
    width: 100,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    employee: 'Ada Lovelace',
    team: 'Engineering',
    hourlyRate: 95,
    hours: 152,
    overtimeHours: 6,
  },
  {
    id: 2,
    employee: 'Grace Hopper',
    team: 'Engineering',
    hourlyRate: 105,
    hours: 160,
    overtimeHours: 0,
  },
  {
    id: 3,
    employee: 'Katherine Johnson',
    team: 'Research',
    hourlyRate: 88,
    hours: 148,
    overtimeHours: 12,
  },
  {
    id: 4,
    employee: 'Margaret Hamilton',
    team: 'Engineering',
    hourlyRate: 110,
    hours: 156,
    overtimeHours: 4,
  },
  {
    id: 5,
    employee: 'Radia Perlman',
    team: 'Research',
    hourlyRate: 92,
    hours: 160,
    overtimeHours: 8,
  },
  {
    id: 6,
    employee: 'Barbara Liskov',
    team: 'Research',
    hourlyRate: 98,
    hours: 140,
    overtimeHours: 0,
  },
];

const initialComputedColumns = [
  {
    field: 'regularPay',
    headerName: 'Regular pay',
    formula: '=hourlyRate * hours',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
  },
  {
    field: 'overtimePay',
    headerName: 'Overtime pay',
    formula: '=hourlyRate * 1.5 * overtimeHours',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
  },
  {
    field: 'totalPay',
    headerName: 'Total pay',
    formula: '=regularPay + overtimePay',
    type: 'number',
    numberFormat: { style: 'currency', currency: 'USD' },
  },
];

export default function ComputedColumnsControlled() {
  const [computedColumns, setComputedColumns] = React.useState(
    initialComputedColumns,
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: 380 }}>
        <DataGridPremium
          featureDependencies={{ formula: formulaFeature }}
          rows={rows}
          columns={columns}
          computedColumns={computedColumns}
          onComputedColumnsChange={setComputedColumns}
          showToolbar
          rowSelection={false}
          disablePivoting
        />
      </div>
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Computed columns model
      </Typography>
      <Typography
        component="pre"
        variant="body2"
        sx={{
          m: 0,
          p: 1.5,
          maxHeight: 220,
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: 12,
          borderRadius: 1,
          bgcolor: 'action.hover',
        }}
      >
        {JSON.stringify(computedColumns, null, 2)}
      </Typography>
    </div>
  );
}
