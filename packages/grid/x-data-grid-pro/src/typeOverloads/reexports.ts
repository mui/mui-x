import * as React from 'react';
import {
  GridApiCommon,
  getGridNumericOperators as getGridNumericOperatorsUntyped,
  getGridNumericColumnOperators as getGridNumericColumnOperatorsUnTyped,
  getGridBooleanOperators as getGridBooleanOperatorsUntyped,
  getGridStringOperators as getGridStringOperatorsUntyped,
  getGridSingleSelectOperators as getGridSingleSelectOperatorsUntyped,
  getGridDateOperators as getGridDateOperatorsUntyped,
} from '@mui/x-data-grid';

import type { GridApiPro } from '../models/gridApiPro';
import type { GridInitialStatePro, GridStatePro } from '../models/gridStatePro';
import type { GridFilterOperator } from '../models/gridFilterOperator';

export { useGridApiContext } from '../hooks/utils/useGridApiContext';
export { useGridApiRef } from '../hooks/utils/useGridApiRef';
export { useGridRootProps } from '../hooks/utils/useGridRootProps';
export * from '../models/gridCellParams';
export * from '../models/gridColDef';
export * from '../models/gridSortModel';
export * from '../models/gridSortModelParams';
export * from '../models/gridFilterOperator';

/**
 * The full grid API.
 */
export type GridApi = GridApiPro;

/**
 * @deprecated Use `React.MutableRefObject<GridApi>` instead
 */
export type GridApiRef = React.MutableRefObject<GridApiPro>;

/**
 * The state of `DataGridPro`.
 */
export type GridState = GridStatePro;

/**
 * The initial state of `DataGridPro`.
 */
export type GridInitialState = GridInitialStatePro;

export const getGridNumericOperators = getGridNumericOperatorsUntyped as <
  Api extends GridApiCommon = GridApiPro,
>() => GridFilterOperator<any, number | string | null, any, Api>[];

export const getGridNumericColumnOperators = getGridNumericColumnOperatorsUnTyped as <
  Api extends GridApiCommon = GridApiPro,
>() => GridFilterOperator<any, number | string | null, any, Api>[];

export const getGridBooleanOperators = getGridBooleanOperatorsUntyped as <
  Api extends GridApiCommon = GridApiPro,
>() => GridFilterOperator<any, boolean | null, any, Api>[];

export const getGridStringOperators = getGridStringOperatorsUntyped as <
  Api extends GridApiCommon = GridApiPro,
>() => GridFilterOperator<any, any, any, Api>[];

export const getGridSingleSelectOperators = getGridSingleSelectOperatorsUntyped as <
  Api extends GridApiCommon = GridApiPro,
>() => GridFilterOperator<any, any, any, Api>[];

export const getGridDateOperators = getGridDateOperatorsUntyped as <
  Api extends GridApiCommon = GridApiPro,
>() => GridFilterOperator<any, string | number | Date, any, Api>[];
