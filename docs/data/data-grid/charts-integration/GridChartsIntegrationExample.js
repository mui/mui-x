import * as React from 'react';
import {
  DataGridPremium,
  GridChartsConfigurationPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererBridge,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-pro/ChartsRenderer';

const rows = [
  { id: 1, name: 'A', points: 10 },
  { id: 2, name: 'B', points: 20 },
  { id: 3, name: 'C', points: 15 },
  { id: 4, name: 'D', points: 25 },
  { id: 5, name: 'E', points: 30 },
  { id: 6, name: 'F', points: 35 },
  { id: 7, name: 'G', points: 40 },
  { id: 8, name: 'H', points: 35 },
  { id: 9, name: 'I', points: 20 },
  { id: 10, name: 'J', points: 25 },
];

const columns = [
  { field: 'name', headerName: 'Name', editable: true },
  {
    field: 'points',
    type: 'number',
    headerName: 'Points',
    width: 120,
    editable: true,
  },
];

export default function GridChartsIntegrationExample() {
  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 370 }}>
          <DataGridPremium
            rows={rows}
            columns={columns}
            showToolbar
            chartsIntegration
            slots={{
              chartsConfigurationPanel: GridChartsConfigurationPanel,
            }}
            slotProps={{
              chartsConfigurationPanel: {
                schema: configurationOptions,
              },
            }}
          />
        </div>
        <GridChartsRendererBridge renderer={ChartsRenderer} />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
