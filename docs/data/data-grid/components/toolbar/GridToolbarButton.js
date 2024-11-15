import * as React from 'react';
import { Grid } from '@mui/x-data-grid';
import PrintIcon from '@mui/icons-material/Print';

// IGNORE THE FOLLOWING IMPORT
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext'; // eslint-disable-line

export default function GridToolbarButton() {
  return (
    <DemoContainer>
      <Grid.Toolbar.Button>
        <PrintIcon fontSize="small" /> Print
      </Grid.Toolbar.Button>
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
