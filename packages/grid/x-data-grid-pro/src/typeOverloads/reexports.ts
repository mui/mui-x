import * as React from 'react';
import {
  GridApiCommon,
  GridFilterOperator,
  getGridNumericOperators as getGridNumericOperatorsUntyped,
  getGridNumericColumnOperators as getGridNumericColumnOperatorsUnTyped,
  getGridBooleanOperators as getGridBooleanOperatorsUntyped,
  getGridStringOperators as getGridStringOperatorsUntyped,
  getGridSingleSelectOperators as getGridSingleSelectOperatorsUntyped,
  getGridDateOperators as getGridDateOperatorsUntyped,
} from '@mui/x-data-grid';

import type { GridApiPro } from '../models/gridApiPro';
import { GridInitialStatePro, GridStatePro } from '../models/gridStatePro';

export { useGridApiContext } from '../hooks/utils/useGridApiContext';
export { useGridApiRef } from '../hooks/utils/useGridApiRef';
export { useGridRootProps } from '../hooks/utils/useGridRootProps';
export * from '../models/gridCellParams';
export * from '../models/gridColDef';
export * from '../models/gridSortModel';
export * from '../models/gridSortModelParams';

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

type FilterOperatorGetter = <Api extends GridApiCommon = GridApiPro>() => GridFilterOperator<Api>[];

export const getGridNumericOperators = getGridNumericOperatorsUntyped as FilterOperatorGetter;

export const getGridNumericColumnOperators =
  getGridNumericColumnOperatorsUnTyped as FilterOperatorGetter;

export const getGridBooleanOperators = getGridBooleanOperatorsUntyped as FilterOperatorGetter;

export const getGridStringOperators = getGridStringOperatorsUntyped as FilterOperatorGetter;

export const getGridSingleSelectOperators =
  getGridSingleSelectOperatorsUntyped as FilterOperatorGetter;

export const getGridDateOperators = getGridDateOperatorsUntyped as FilterOperatorGetter;
