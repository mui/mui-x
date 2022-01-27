/* eslint-disable import/export */
/* eslint-disable import/first */
export {} from './x-data-grid-interfaces';

import * as React from 'react';
import { GridApiCommon } from '@mui/x-data-grid';
import { GridApiPro, GridInitialStatePro, GridStatePro } from './internals';

// Explicitly re-export the methods already exported from `@mui/x-data-grid` but with a different signature
export { useGridApiContext, useGridRootProps, useGridApiRef } from './internals';

export * from '@mui/x-data-grid';
export { LicenseInfo } from '@mui/x-license-pro';
export * from './DataGridPro';
export * from './internals';

/**
 * @deprecated Use `GridApiPro`
 */
export type GridApi = GridApiPro;

export type GridApiRef<Api extends GridApiCommon = GridApiPro> = React.MutableRefObject<Api>;

/**
 * @deprecated Use `GridInitialStatePro` instead.
 */
export type GridInitialState = GridInitialStatePro;

/**
 * @deprecated Use `GridStateCommunity` instead.
 */
export type GridState = GridStatePro;
