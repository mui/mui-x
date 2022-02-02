import * as React from 'react';

/* eslint-disable import/export */
import {
  useGridApiContext as useUntypedGridApiContext,
  useGridApiRef as useUntypedGridApiRef,
  GridApiCommon,
} from '../../_modules_';
import { GridApiCommunity } from '../../_modules_/grid/models/api/gridApiCommunity';
import {
  GridStateCommunity,
  GridInitialStateCommunity,
} from '../../_modules_/grid/models/gridStateCommunity';

export * from '../../_modules_';
export * from './DataGrid';
export type { DataGridProps } from '../../_modules_/grid/models/props/DataGridProps';
export * from './useDataGridComponent';

export { MAX_PAGE_SIZE } from './useDataGridProps';

// Typing override to avoid breaking change until `__modules__` is removed

export const useGridApiContext = useUntypedGridApiContext as <
  Api extends GridApiCommon = GridApiCommunity,
>() => React.MutableRefObject<Api>;

export const useGridApiRef = useUntypedGridApiRef as <
  Api extends GridApiCommon = GridApiCommunity,
>() => React.MutableRefObject<Api>;

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
