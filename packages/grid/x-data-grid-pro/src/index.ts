/* eslint-disable import/export */
/* eslint-disable import/first */
import type {} from './x-data-grid-interfaces';

// Explicitly re-export the methods already exported from `@mui/x-data-grid` but with a different signature
export { useGridApiContext, useGridRootProps, useGridApiRef } from './internals';

// Explicitly re-export the types already exported from `@mui/x-data-grid` but with a different signature
export type {
  GridApi,
  GridApiRef,
  GridInitialState,
  GridState,
} from './internals/models/legacyCrossPlanInterfaces';

export * from '@mui/x-data-grid';
export { LicenseInfo } from '@mui/x-license-pro';
export * from './DataGridPro';
export * from './internals';
