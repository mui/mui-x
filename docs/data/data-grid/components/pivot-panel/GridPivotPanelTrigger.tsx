import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  PivotPanelTrigger,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Pivot">
        <PivotPanelTrigger
          render={(triggerProps, state) => (
            <ToolbarButton
              {...triggerProps}
              color={state.active ? 'primary' : 'default'}
            />
          )}
        >
          <PivotTableChartIcon fontSize="small" />
        </PivotPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function GridPivotPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        experimentalFeatures={{
          pivoting: true,
        }}
      />
    </div>
  );
}
