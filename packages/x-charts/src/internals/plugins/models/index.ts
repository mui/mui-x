import { ChartItemIdentifier, ChartSeriesType } from '../../../models/seriesType/config';

export type ItemInteractionData<T extends ChartSeriesType> = ChartItemIdentifier<T>;

export type AxisInteractionData = {
  x: null | {
    value: number | Date | string;
    // Set to -1 if no index.
    index: number;
  };
  y: null | {
    value: number | Date | string;
    // Set to -1 if no index.
    index: number;
  };
};

type InteractionState = {
  /**
   * The item currently interacting.
   */
  item: null | ItemInteractionData<ChartSeriesType>;
  /**
   * The x- and y-axes currently interacting.
   */
  axis: AxisInteractionData;
  /**
   * Set to `true` when `VoronoiHandler` is active.
   * Used to prevent collision with mouseEnter events.
   */
  useVoronoiInteraction?: boolean;
};

export type ChartsStateCacheKey = { id: number };

export type ChartsState = {
  interaction: InteractionState;
  cacheKey: ChartsStateCacheKey;
};
