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
 * The state of Data Grid Premium.
 */
export type GridState = GridStatePremium;

/**
 * The initial state of Data Grid Premium.
 */
export type GridInitialState = GridInitialStatePremium;
