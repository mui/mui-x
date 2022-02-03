import * as React from 'react';
import { GridApiCommunity } from '../../_modules_/grid/models/api/gridApiCommunity';
import {
  GridInitialStateCommunity,
  GridStateCommunity,
} from '../../_modules_/grid/models/gridStateCommunity';
import { useGridApiContext as useUntypedGridApiContext } from '../../_modules_/grid/hooks/utils/useGridApiContext';
import { useGridApiRef as useUntypedGridApiRef } from '../../_modules_/grid/hooks/utils/useGridApiRef';
import { GridApiCommon } from '../../_modules_';

/**
 * The full grid API.
 */
export type GridApi = GridApiCommunity;

/**
 * The state of `DataGrid`.
 */
export type GridState = GridStateCommunity;

/**
 * The initial state of `DataGrid`.
 */
export type GridInitialState = GridInitialStateCommunity;

/**
 * @deprecated Use `React.MutableRefObject<GridApi>` instead
 */
export type GridApiRef = React.MutableRefObject<GridApiCommunity>;

export * from '../../_modules_/grid/models/colDef/gridColDef';
export * from '../../_modules_/grid/models/colDef/gridDateOperators';
export * from '../../_modules_/grid/models/colDef/gridStringOperators';
export * from '../../_modules_/grid/models/colDef/gridSingleSelectOperators';
export * from '../../_modules_/grid/models/colDef/gridBooleanOperators';
export * from '../../_modules_/grid/models/colDef/gridNumericOperators';
export * from '../../_modules_/grid/models/params/gridCellParams';
export * from '../../_modules_/grid/models/params/gridSortModelParams';
export * from '../../_modules_/grid/models/gridSortModel';

export const useGridApiContext = useUntypedGridApiContext as <
  Api extends GridApiCommon = GridApiCommunity,
>() => React.MutableRefObject<Api>;

export const useGridApiRef = useUntypedGridApiRef as <
  Api extends GridApiCommon = GridApiCommunity,
>() => React.MutableRefObject<Api>;
