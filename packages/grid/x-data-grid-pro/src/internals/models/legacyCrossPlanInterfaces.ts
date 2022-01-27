import * as React from 'react';
import { GridApiCommon } from '@mui/x-data-grid';
import { GridStatePro, GridInitialStatePro } from './gridStatePro';
import { GridApiPro } from './gridApiPro';

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
