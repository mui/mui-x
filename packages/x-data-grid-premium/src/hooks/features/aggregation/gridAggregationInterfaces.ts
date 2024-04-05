import { GridRowId, GridRowModel, GridColDef, GridValueFormatter } from '@mui/x-data-grid-pro';

export interface GridAggregationState {
  model: GridAggregationModel;
  lookup: GridAggregationLookup;
}

export interface GridAggregationInitialState {
  model?: GridAggregationModel;
}

export interface GridAggregationInternalCache {
  rulesOnLastColumnHydration: GridAggregationRules;
  rulesOnLastRowHydration: GridAggregationRules;
}

export interface GridAggregationApi {
  /**
   * Sets the aggregation model to the one given by `model`.
   * @param {GridAggregationModel} model The aggregation model.
   */
  setAggregationModel: (model: GridAggregationModel) => void;
}

export interface GridAggregationGetCellValueParams {
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel;
}

/**
 * Grid aggregation function definition interface.
 * @demos
 *   - [Aggregation functions](/x/react-data-grid/aggregation/#aggregation-functions)
 */
export interface GridAggregationFunction<V = any, AV = V> {
  /**
   * Function that takes the current cell values and generates the aggregated value.
   * @template V, AV
   * @param {GridAggregationParams<V>} params The params of the current aggregated cell.
   * @returns {AV} The aggregated value.
   */
  apply: (params: GridAggregationParams<V>) => AV | null | undefined;
  /**
   * Label of the aggregation function.
   * Will be used to add a label on the footer of the grouping column when this aggregation function is the only one being used.
   * @default apiRef.current.getLocaleText('aggregationFunctionLabel{capitalize(name)})
   */
  label?: string;
  /**
   * Column types supported by this aggregation function.
   * If not defined, all types are supported (in most cases this property should be defined).
   */
  columnTypes?: string[];
  /**
   * Function that allows to apply a formatter to the aggregated value.
   * If not defined, the grid will use the formatter of the column.
   */
  valueFormatter?: GridValueFormatter;
  /**
   * Indicates if the aggregated value have the same unit as the cells used to generate it.
   * It can be used to apply a custom cell renderer only if the aggregated value has the same unit.
   * @default true
   */
  hasCellUnit?: boolean;
  /**
   * Function that allows to transform the value of the cell passed to the aggregation function applier.
   * Useful for aggregating data from multiple row fields.
   * @demo https://mui.com/x/react-data-grid/aggregation/#aggregating-data-from-multiple-row-fields
   * @param {GridAggregationGetCellValueParams} params The params of the current cell
   * @returns {V} The value of the cell that will be passed to the aggregation `apply` function
   */
  getCellValue?: (params: GridAggregationGetCellValueParams) => V;
}

interface GridAggregationParams<V = any> {
  values: (V | undefined)[];
  groupId: GridRowId;
  field: GridColDef['field'];
}

export type GridAggregationModel = {
  [field: string]: string;
};

export type GridAggregationLookup = {
  [rowId: GridRowId]: {
    [field: string]: {
      position: GridAggregationPosition;
      value: any;
    };
  };
};

export type GridAggregationPosition = 'inline' | 'footer';

export interface GridAggregationCellMeta {
  /**
   * If `true`, the current aggregated value has the same unit as the value of the other cells of this row.
   * For instance, "min" / "max" aggregation have the same unit as the other cells.
   * If `false`, the current aggregated value has another unit or not unit.
   * For instance, "size" aggregation has no unit.
   */
  hasCellUnit: boolean;
  /**
   * Name of the aggregation function currently applied on this cell.
   */
  aggregationFunctionName: string;
}

export interface GridAggregationHeaderMeta {
  aggregationRule: GridAggregationRule;
}

export interface GridAggregationRule {
  aggregationFunctionName: string;
  aggregationFunction: GridAggregationFunction;
}

/**
 * Object containing all the aggregation rules that must be applied to the current columns.
 * Unlike the aggregation model, those rules are sanitized and do not contain:
 * - items for non-existing columns
 * - items for non-aggregable columns (GridColDef.aggregable = false)
 * - items for non-existing aggregation function
 * - items for non-available aggregation function on the column (GridColDef.availableAggregationFunctions)
 */
export type GridAggregationRules = { [field: string]: GridAggregationRule };
