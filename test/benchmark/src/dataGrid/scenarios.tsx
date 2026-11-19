import * as React from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { defineScenario } from '../utils/scenario';

const COLUMN_COUNT = 10;
const COUNTRIES = [
  'France',
  'Belgium',
  'Spain',
  'Italy',
  'Germany',
  'Portugal',
  'Austria',
  'Poland',
];

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'country', headerName: 'Country', width: 120 },
  ...Array.from({ length: COLUMN_COUNT - 2 }, (_, index) => ({
    field: `value${index}`,
    headerName: `Value ${index}`,
    type: 'number' as const,
    width: 110,
  })),
];

function createRows(count: number) {
  return Array.from({ length: count }, (_, id) => {
    const row: Record<string, number | string> = { id, country: COUNTRIES[id % COUNTRIES.length] };
    for (let index = 0; index < COLUMN_COUNT - 2; index += 1) {
      row[`value${index}`] = (id * 31 + index * 17) % 1000;
    }
    return row;
  });
}

const rows1k = createRows(1_000);
const rows10k = createRows(10_000);

export const dataGrid = defineScenario('DataGrid with 1,000 rows', () => (
  <div style={{ width: 1000, height: 500 }}>
    <DataGrid rows={rows1k} columns={columns} />
  </div>
));

export const dataGridPro = defineScenario('DataGridPro with 1,000 rows and pinned columns', () => (
  <div style={{ width: 1000, height: 500 }}>
    <DataGridPro
      rows={rows1k}
      columns={columns}
      initialState={{ pinnedColumns: { left: ['id'], right: ['value7'] } }}
    />
  </div>
));

export const dataGridPremium = defineScenario(
  'DataGridPremium with 10,000 rows grouped and aggregated',
  () => (
    <div style={{ width: 1000, height: 500 }}>
      <DataGridPremium
        rows={rows10k}
        columns={columns}
        initialState={{
          rowGrouping: { model: ['country'] },
          aggregation: { model: { value0: 'sum', value1: 'avg' } },
        }}
        defaultGroupingExpansionDepth={-1}
      />
    </div>
  ),
);
