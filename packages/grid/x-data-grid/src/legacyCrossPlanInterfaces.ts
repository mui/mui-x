import {
  GridApiCommon,
  GridApiCommunity,
  GridApiRef,
  GridInitialStateCommunity,
  GridStateCommunity,
} from '../../_modules_';

import { useGridApiContext as useUntypedGridApiContext } from '../../_modules_/grid/hooks/utils/useGridApiContext';
import { useGridApiRef as useUntypedGridApiRef } from '../../_modules_/grid/hooks/utils/useGridApiRef';

/**
 * @deprecated Use `GridApiCommunity`
 */
export type GridApi = GridApiCommunity;

/**
 * @deprecated Use `GridInitialStateCommunity` instead.
 */
export type GridInitialState = GridInitialStateCommunity;

/**
 * @deprecated Use `GridStateCommunity` instead.
 */
export type GridState = GridStateCommunity;

export const useGridApiContext = useUntypedGridApiContext as <
  Api extends GridApiCommon = GridApiCommunity,
>() => GridApiRef<Api>;

export const useGridApiRef = useUntypedGridApiRef as <
  Api extends GridApiCommon = GridApiCommunity,
>() => GridApiRef<Api>;
