import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import {
  GridChartsIntegrationContextProvider,
  GridChartsIntegrationRendererBridge,
} from '@mui/x-data-grid-premium/context';
import { ChartsRenderer } from '@mui/x-charts-pro/ChartsRenderer';

const rows = [
  { id: 1, name: 'A', value: 10 },
  { id: 2, name: 'B', value: 20 },
  { id: 3, name: 'C', value: 15 },
  { id: 4, name: 'D', value: 25 },
  { id: 5, name: 'E', value: 30 },
  { id: 6, name: 'F', value: 35 },
  { id: 7, name: 'G', value: 40 },
  { id: 8, name: 'H', value: 35 },
  { id: 9, name: 'I', value: 20 },
  { id: 10, name: 'J', value: 25 },
];

const columns = [
  { field: 'name', headerName: 'Name', width: 120 },
  { field: 'value', headerName: 'Value', width: 120 },
];

export default function GridChartsIntegrationExample() {
  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32 }}>
        <div style={{ height: 300 }}>
          <DataGridPremium rows={rows} columns={columns} showToolbar />
        </div>
        <GridChartsIntegrationRendererBridge renderer={ChartsRenderer} />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
