import * as React from 'react';
import { GridToolbarV8 as GridToolbar } from '@mui/x-data-grid';
import ColumnsLayoutIcon from '@mui/icons-material/ViewWeek';
import ListLayoutIcon from '@mui/icons-material/ViewStream';

// IGNORE THE FOLLOWING IMPORTS
import MUIToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MUIToggleButton from '@mui/material/ToggleButton';
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext'; // eslint-disable-line

export default function GridToolbarToggleButtonGroup() {
  const [layout, setLayout] = React.useState('columns');

  return (
    <DemoContainer>
      <GridToolbar.ToggleButtonGroup value={layout}>
        <GridToolbar.ToggleButton
          color="primary"
          value="columns"
          onChange={() => setLayout('columns')}
        >
          <ColumnsLayoutIcon fontSize="small" />
        </GridToolbar.ToggleButton>
        <GridToolbar.ToggleButton
          color="primary"
          value="list"
          onChange={() => setLayout('list')}
        >
          <ListLayoutIcon fontSize="small" />
        </GridToolbar.ToggleButton>
      </GridToolbar.ToggleButtonGroup>
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
