import * as React from 'react';
import { Grid } from '@mui/x-data-grid';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

// IGNORE THE FOLLOWING IMPORT
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext'; // eslint-disable-line

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

// WARNING: DO NOT USE ANY OF THE FOLLOWING IN YOUR CODE
// IT IS FOR DEMONSTRATION PURPOSES ONLY.
const contextValue = { slots: {} };
function DemoContainer({ children }) {
  return (
    <GridRootPropsContext.Provider value={contextValue}>
      {children}
    </GridRootPropsContext.Provider>
  );
}
