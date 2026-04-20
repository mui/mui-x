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
  /**
   * Position of the aggregated value.
   */
  position: GridAggregationPosition;
}
