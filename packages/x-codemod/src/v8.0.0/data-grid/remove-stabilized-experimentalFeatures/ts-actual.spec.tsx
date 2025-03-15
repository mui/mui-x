// @ts-nocheck
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

// prettier-ignore
function App() {
  return (
    <React.Fragment>
      <DataGridPremium
        experimentalFeatures={{
          warnIfFocusStateIsNotSynced: true,
          ariaV8: true,
        }}
      />
      <DataGridPremium
        experimentalFeatures={{
          ariaV8: true,
        }}
      />
      <DataGridPremium {...props} />
    </React.Fragment>
  );
}

export default App;
