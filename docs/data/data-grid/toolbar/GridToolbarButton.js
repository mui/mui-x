import * as React from 'react';
import { GridToolbarV8 as GridToolbar } from '@mui/x-data-grid';
import PrintIcon from '@mui/icons-material/Print';

// IGNORE THE FOLLOWING IMPORT
import { GridRootPropsContext } from '@mui/x-data-grid/context/GridRootPropsContext'; // eslint-disable-line

export default function GridToolbarButton() {
  return (
    <DemoContainer>
      <GridToolbar.Button>
        <PrintIcon fontSize="small" /> Print
      </GridToolbar.Button>
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
