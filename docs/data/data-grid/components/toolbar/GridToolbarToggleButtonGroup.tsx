import * as React from 'react';
import { Grid } from '@mui/x-data-grid';
import ColumnsViewIcon from '@mui/icons-material/ViewWeek';
import ListViewIcon from '@mui/icons-material/ViewStream';

// IGNORE THE FOLLOWING IMPORTS
import MUIToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MUIToggleButton from '@mui/material/ToggleButton';
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext'; // eslint-disable-line

export default function GridToolbarToggleButtonGroup() {
  const [view, setView] = React.useState('columns');

  return (
    <DemoContainer>
      <Grid.Toolbar.ToggleButtonGroup value={view}>
        <Grid.Toolbar.ToggleButton
          color="primary"
          value="columns"
          onChange={() => setView('columns')}
        >
          <ColumnsViewIcon fontSize="small" /> Columns view
        </Grid.Toolbar.ToggleButton>
        <Grid.Toolbar.ToggleButton
          color="primary"
          value="list"
          onChange={() => setView('list')}
        >
          <ListViewIcon fontSize="small" /> List view
        </Grid.Toolbar.ToggleButton>
      </Grid.Toolbar.ToggleButtonGroup>
    </DemoContainer>
  );
}

// WARNING: DO NOT USE ANY OF THE FOLLOWING IN YOUR CODE
// IT IS FOR DEMONSTRATION PURPOSES ONLY.
const contextValue = {
  slots: {
    baseToggleButtonGroup: MUIToggleButtonGroup,
    baseToggleButton: MUIToggleButton,
  },
};
function DemoContainer({ children }: { children: React.ReactNode }) {
  return (
    <GridRootPropsContext.Provider value={contextValue}>
      {children}
    </GridRootPropsContext.Provider>
  );
}
