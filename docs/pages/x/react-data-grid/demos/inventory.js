import * as React from 'react';
import DataGridDemoFrame from '../../../../src/modules/components/demos/data-grid/DataGridDemoFrame';
import InventoryDashboard from '../../../../src/modules/components/demos/data-grid/Inventory/InventoryDashboard';

export default function Page() {
  return (
    <DataGridDemoFrame demoName="inventory">
      <InventoryDashboard />
    </DataGridDemoFrame>
  );
}
