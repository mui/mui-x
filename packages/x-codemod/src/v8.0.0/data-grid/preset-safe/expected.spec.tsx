// @ts-nocheck
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

// prettier-ignore
<React.Fragment>
  <DataGrid rowSpanning />
  <DataGridPro rowSpanning />
  <DataGridPremium
    experimentalFeatures={{
      warnIfFocusStateIsNotSynced: true,
    }}
    rowSpanning />
  <DataGridPremium rowSpanning />
  <DataGridPremium
    {...props}
  />
</React.Fragment>;
