import * as React from 'react';
import type {
  GridColDef as GridColDefUntyped,
  GridActionsColDef as GridActionsColDefUntyped,
  GridEnrichedColDef as GridEnrichedColDefUntyped,
  GridColumns as GridColumnsUntyped,
  GridColTypeDef as GridColTypeDefUntyped,
  GridStateColDef as GridStateColDefUntyped,
} from '../../_modules_/grid/models/colDef/gridColDef';
import type {
  GridCellParams as GridCellParamsUntyped,
  GridRenderCellParams as GridRenderCellParamsUntyped,
  GridRenderEditCellParams as GridRenderEditCellParamsUntyped,
  GridValueGetterParams as GridValueGetterParamsUntyped,
  GridValueGetterFullParams as GridValueGetterFullParamsUntyped,
  GridValueFormatterParams as GridValueFormatterParamsUntyped,
} from '../../_modules_/grid/models/params/gridCellParams';
import type { GridSortModelParams as GridSortModelParamsUntyped } from '../../_modules_/grid/models/params/gridSortModelParams';
import type {
  GridSortCellParams as GridSortCellParamsUntyped,
  GridComparatorFn as GridComparatorFnUntyped,
} from '../../_modules_/grid/models/gridSortModel';
import {
  getGridNumericOperators as getGridNumericOperatorsUntyped,
  getGridNumericColumnOperators as getGridNumericColumnOperatorsUnTyped,
} from '../../_modules_/grid/models/colDef/gridNumericOperators';
import { getGridBooleanOperators as getGridBooleanOperatorsUntyped } from '../../_modules_/grid/models/colDef/gridBooleanOperators';
import { getGridStringOperators as getGridStringOperatorsUntyped } from '../../_modules_/grid/models/colDef/gridStringOperators';
import { getGridSingleSelectOperators as getGridSingleSelectOperatorsUntyped } from '../../_modules_/grid/models/colDef/gridSingleSelectOperators';
import { getGridDateOperators as getGridDateOperatorsUntyped } from '../../_modules_/grid/models/colDef/gridDateOperators';
import type { GridApiPro } from '../../_modules_/grid/models/api/gridApiPro';
import type { GridFilterOperator, GridApiCommon } from '../../_modules_';
import { GridInitialStatePro, GridStatePro } from '../../_modules_/grid/models/gridStatePro';
import { useGridApiContext as useUntypedGridApiContext } from '../../_modules_/grid/hooks/utils/useGridApiContext';
import { useGridApiRef as useUntypedGridApiRef } from '../../_modules_/grid/hooks/utils/useGridApiRef';

export type {
  GridAlignment,
  GridKeyValue,
  GridColumnsMeta,
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from '../../_modules_/grid/models/colDef/gridColDef';

export type {
  GridGroupingValueGetterParams,
  GridPreProcessEditCellProps,
  GridValueSetterParams,
} from '../../_modules_/grid/models/params/gridCellParams';

export type {
  GridSortDirection,
  GridSortItem,
  GridSortModel,
} from '../../_modules_/grid/models/gridSortModel';

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

/**
 * Column Definition interface.
 */
export type GridColDef<Api extends GridApiCommon = GridApiPro> = GridColDefUntyped<Api>;

export type GridActionsColDef<Api extends GridApiCommon = GridApiPro> =
  GridActionsColDefUntyped<Api>;

export type GridEnrichedColDef<Api extends GridApiCommon = GridApiPro> =
  GridEnrichedColDefUntyped<Api>;

export type GridColumns<Api extends GridApiCommon = GridApiPro> = GridColumnsUntyped<Api>;

export type GridColTypeDef<Api extends GridApiCommon = GridApiPro> = GridColTypeDefUntyped<Api>;

export type GridStateColDef<Api extends GridApiCommon = GridApiPro> = GridStateColDefUntyped<Api>;

type FilterOperatorGetter = <Api extends GridApiCommon = GridApiPro>() => GridFilterOperator<Api>[];

export const getGridNumericOperators = getGridNumericOperatorsUntyped as FilterOperatorGetter;

export const getGridNumericColumnOperators =
  getGridNumericColumnOperatorsUnTyped as FilterOperatorGetter;

export const getGridBooleanOperators = getGridBooleanOperatorsUntyped as FilterOperatorGetter;

export const getGridStringOperators = getGridStringOperatorsUntyped as FilterOperatorGetter;

export const getGridSingleSelectOperators =
  getGridSingleSelectOperatorsUntyped as FilterOperatorGetter;

export const getGridDateOperators = getGridDateOperatorsUntyped as FilterOperatorGetter;

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export type GridCellParams<
  V = any,
  R = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridCellParamsUntyped<V, R, F, Api>;

/**
 * GridCellParams containing api.
 */
export type GridRenderCellParams<
  V = any,
  R = any,
  F = V,
  Api extends GridApiCommon = GridApiPro,
> = GridRenderCellParamsUntyped<V, R, F, Api>;

/**
 * GridEditCellProps containing api.
 */
export type GridRenderEditCellParams<Api extends GridApiCommon = GridApiPro> =
  GridRenderEditCellParamsUntyped<Api>;

/**
 * Parameters passed to `colDef.valueGetter`.
 */
export type GridValueGetterParams<
  V = any,
  R = any,
  Api extends GridApiCommon = GridApiPro,
> = GridValueGetterParamsUntyped<V, R, Api>;

/**
 * @deprecated Use `GridValueGetterParams` instead.
 */
export type GridValueGetterFullParams<
  V = any,
  R = any,
  Api extends GridApiCommon = GridApiPro,
> = GridValueGetterFullParamsUntyped<V, R, Api>;

/**
 * Object passed as parameter in the column [[GridColDef]] value formatter callback.
 */
export type GridValueFormatterParams<Api extends GridApiCommon = GridApiPro> =
  GridValueFormatterParamsUntyped<Api>;

/**
 * Object passed as parameter of the column sorted event.
 */
export type GridSortModelParams<Api extends GridApiCommon = GridApiPro> =
  GridSortModelParamsUntyped<Api>;

export type GridSortCellParams<Api extends GridApiCommon = GridApiPro> =
  GridSortCellParamsUntyped<Api>;

export type GridComparatorFn<Api extends GridApiCommon = GridApiPro> = GridComparatorFnUntyped<Api>;

export const useGridApiContext = useUntypedGridApiContext as <
  Api extends GridApiCommon = GridApiPro,
>() => React.MutableRefObject<Api>;

export const useGridApiRef = useUntypedGridApiRef as <
  Api extends GridApiCommon = GridApiPro,
>() => React.MutableRefObject<Api>;
