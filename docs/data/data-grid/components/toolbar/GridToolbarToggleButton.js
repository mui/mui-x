import * as React from 'react';
import { DemoContainer } from '@mui/x-data-grid/internals/demo';
import { Grid } from '@mui/x-data-grid';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

export default function GridToolbarToggleButton() {
  const [pivotEnabled, setPivotEnabled] = React.useState(false);

  return (
    <DemoContainer>
      <Grid.Toolbar.ToggleButton
        color="primary"
        value="filters"
        selected={pivotEnabled}
        onChange={() => setPivotEnabled(!pivotEnabled)}
      >
        <PivotTableChartIcon fontSize="small" /> Pivot
      </Grid.Toolbar.ToggleButton>
    </DemoContainer>
  );
}
