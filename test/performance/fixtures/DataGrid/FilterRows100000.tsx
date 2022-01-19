import * as React from 'react';
import { DataGridPro, GridPreferencePanelsValue } from '@mui/x-data-grid-pro';
import { useData } from 'storybook/src/hooks/useData';

export default function FilterRows100000() {
  const data = useData(100000, 10);
  return (
    <div style={{ width: 500, height: 300 }}>
      <DataGridPro
        columns={data.columns}
        rows={data.rows}
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
