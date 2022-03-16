interface GridAggregationParams<V = any> {
  values: V[];
}

export type GridAggregationFunction<V = any> = {
  apply: (params: GridAggregationParams<V>) => number;
  types: string[];
};

export interface GridAggregationItem {
  method: string;
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
