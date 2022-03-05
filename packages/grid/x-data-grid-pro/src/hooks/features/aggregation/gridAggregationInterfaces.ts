/**
 * TODO: Add generic for rows
 */
interface GridAggregationParams<V = any> {
  values: V[];
}

export type GridAggregationFunction<V = any> = {
  apply: (params: GridAggregationParams<V>) => number;
  types: string[];
};
