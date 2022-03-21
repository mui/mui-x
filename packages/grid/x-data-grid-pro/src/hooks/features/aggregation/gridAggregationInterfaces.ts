import { GridValueFormatterParams } from '@mui/x-data-grid';

interface GridAggregationParams<V = any> {
  values: V[];
}

export type GridAggregationFunction<V = any, AV = V> = {
  apply: (params: GridAggregationParams<V>) => AV;
  valueFormatter?: (params: GridValueFormatterParams) => any;
  types: string[];

  /**
   * @default `true`
   */
  hasCellUnit?: boolean;
};

export interface GridAggregationItem {
  functionName: string;
}

export type GridAggregationModel = Record<string, GridAggregationItem>;

export interface GridAggregationState {
  model: GridAggregationModel;
}

export interface GridAggregationInitialState {
  model?: GridAggregationModel;
}

export interface GridAggregationApi {
  /**
   * Sets the aggregation rules.
   * @param {GridAggregationModel} model The aggregated columns.
   */
  setAggregationModel: (model: GridAggregationModel) => void;
}

export interface GridAggregationCellMeta {
  /**
   * If `true`, the current aggregated value has the same unit as the value of the other cells of this row.
   * For instance, "min" / "max" aggregation have the same unit as the other cells.
   * If `false`, the current aggregated value has another unit or not unit.
   * For instance, "size" aggregation has no unit.
   */
  hasCellUnit: boolean;
  name: string;
}
