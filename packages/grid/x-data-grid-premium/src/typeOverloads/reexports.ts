import * as React from 'react';
import type { GridApiPremium } from '../models/gridApiPremium';
import { GridInitialStatePremium, GridStatePremium } from '../models/gridStatePremium';

export { useGridApiContext } from '../hooks/utils/useGridApiContext';
export { useGridApiRef } from '../hooks/utils/useGridApiRef';
export { useGridRootProps } from '../hooks/utils/useGridRootProps';

/**
 * The full grid API.
 */
export type GridApi = GridApiPremium;

/**
 * @deprecated Use `React.MutableRefObject<GridApi>` instead
 */
export type GridApiRef = React.MutableRefObject<GridApiPremium>;

/**
 * The state of `DataGridPremium`.
 */
export type GridState = GridStatePremium;

/**
 * The initial state of `DataGridPremium`.
 */
export type GridInitialState = GridInitialStatePremium;
