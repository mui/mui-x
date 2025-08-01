import * as React from 'react';
import DataGridDemoFrame from '../../../../src/modules/components/demos/data-grid/DataGridDemoFrame';
import StockDashboard from '../../../../src/modules/components/demos/data-grid/StockDashboard/StockDashboard';

export default function Page() {
  return (
    <DataGridDemoFrame demoName="real-time-data">
      <StockDashboard />
    </DataGridDemoFrame>
  );
}
