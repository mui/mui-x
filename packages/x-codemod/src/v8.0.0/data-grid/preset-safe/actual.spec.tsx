// @ts-nocheck
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { DataGridPremium } from '@mui/x-data-grid-premium';

// prettier-ignore
<React.Fragment>
  <DataGrid
    indeterminateCheckboxAction="deselect"
    rowPositionsDebounceMs={100}
    unstable_rowSpanning
  />
  <DataGridPro
    indeterminateCheckboxAction="deselect"
    rowPositionsDebounceMs={100}
    unstable_rowSpanning
  />
  <DataGridPremium
    experimentalFeatures={{
      warnIfFocusStateIsNotSynced: true,
      ariaV8: true,
    }}
    indeterminateCheckboxAction="deselect"
    rowPositionsDebounceMs={100}
    unstable_rowSpanning
  />
  <DataGridPremium
    experimentalFeatures={{
      ariaV8: true,
    }}
    unstable_rowSpanning
  />
  <DataGridPremium
    {...props}
  />
</React.Fragment>;
