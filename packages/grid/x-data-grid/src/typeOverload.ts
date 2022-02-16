import * as React from 'react';
import { GridApiCommunity } from './internals/models/api/gridApiCommunity';
import {
  GridInitialStateCommunity,
  GridStateCommunity,
} from './internals/models/gridStateCommunity';
import { useGridApiContext as useUntypedGridApiContext } from './internals/hooks/utils/useGridApiContext';
import { useGridApiRef as useUntypedGridApiRef } from './internals/hooks/utils/useGridApiRef';
import { GridApiCommon } from './internals/models/api/gridApiCommon';

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

export type {
  GridStateColDef,
  GridColDef,
  GridColumns,
  GridColTypeDef,
  GridActionsColDef,
  GridEnrichedColDef,
} from './internals/models/colDef/gridColDef';
export * from './internals/models/colDef/gridDateOperators';
export * from './internals/models/colDef/gridStringOperators';
export * from './internals/models/colDef/gridSingleSelectOperators';
export * from './internals/models/colDef/gridBooleanOperators';
export * from './internals/models/colDef/gridNumericOperators';
export type {
  GridRenderCellParams,
  GridCellParams,
  GridRenderEditCellParams,
  GridValueFormatterParams,
  GridValueGetterParams,
  GridValueGetterFullParams,
} from './internals/models/params/gridCellParams';
export type { GridSortModelParams } from './internals/models/params/gridSortModelParams';
export type { GridSortCellParams, GridComparatorFn } from './internals/models/gridSortModel';

export const useGridApiContext = useUntypedGridApiContext as <
  Api extends GridApiCommon = GridApiCommunity,
>() => React.MutableRefObject<Api>;

export const useGridApiRef = useUntypedGridApiRef as <
  Api extends GridApiCommon = GridApiCommunity,
>() => React.MutableRefObject<Api>;
