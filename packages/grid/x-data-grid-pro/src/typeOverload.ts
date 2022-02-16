import * as React from 'react';
import { GridApiCommon, GridFilterOperator } from '@mui/x-data-grid/internals';
import {
  getGridNumericOperators as getGridNumericOperatorsUntyped,
  getGridNumericColumnOperators as getGridNumericColumnOperatorsUnTyped,
} from '@mui/x-data-grid/internals/models/colDef/gridNumericOperators';
import { getGridBooleanOperators as getGridBooleanOperatorsUntyped } from '@mui/x-data-grid/internals/models/colDef/gridBooleanOperators';
import { getGridStringOperators as getGridStringOperatorsUntyped } from '@mui/x-data-grid/internals/models/colDef/gridStringOperators';
import { getGridSingleSelectOperators as getGridSingleSelectOperatorsUntyped } from '@mui/x-data-grid/internals/models/colDef/gridSingleSelectOperators';
import { getGridDateOperators as getGridDateOperatorsUntyped } from '@mui/x-data-grid/internals/models/colDef/gridDateOperators';

import type { GridApiPro } from './internals/models/gridApiPro';
import { GridInitialStatePro, GridStatePro } from './internals/models/gridStatePro';

export { useGridApiContext } from './internals/hooks/utils/useGridApiContext';
export { useGridApiRef } from './internals/hooks/utils/useGridApiRef';
export { useGridRootProps } from './internals/hooks/utils/useGridRootProps';
export * from './internals/models/gridCellParams';
export * from './internals/models/gridColDef';
export * from './internals/models/gridSortModel';
export * from './internals/models/gridSortModelParams';

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
