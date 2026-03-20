// @ts-nocheck
import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';

// prettier-ignore
function App() {
  return (
    <React.Fragment>
      <DataGridPremium
        experimentalFeatures={{
          charts: true,
        }}
        chartsIntegration
        rows={[]}
        columns={[]}
      />
      <DataGridPremium
        experimentalFeatures={{
          charts: true,
          warnIfFocusStateIsNotSynced: true,
        }}
        chartsIntegration
        rows={[]}
        columns={[]}
      />
      <DataGridPremium {...props} />
    </React.Fragment>
  );
}

export default App;
