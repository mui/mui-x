import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import { GridPreferencePanelsValue } from '../../packages/grid/_modules_';

export default function Playground() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    maxColumns: 15,
  });

  return (
    <div style={{ width: '100%', height: 600 }}>
      <DataGridPro
        {...data}
        initialState={{
          preferencePanel: {
            open: true,
            openedPanelValue: GridPreferencePanelsValue.filters,
          },
        }}
      />
    </div>
  );
}
