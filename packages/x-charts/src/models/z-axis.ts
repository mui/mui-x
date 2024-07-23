import type { ScaleOrdinal, ScaleSequential, ScaleThreshold } from 'd3-scale';
import { ContinuousColorConfig, OrdinalColorConfig, PiecewiseColorConfig } from './colorMapping';

export interface ZAxisConfig<V = any> {
  id: string;
  data?: V[];
  /**
   * The key used to retrieve `data` from the `dataset` prop.
   */
  dataKey?: string;
  colorMap?: OrdinalColorConfig | ContinuousColorConfig | PiecewiseColorConfig;
}

export interface ZAxisDefaultized extends ZAxisConfig {
  colorScale?:
    | ScaleOrdinal<string | number | Date, string, string | null>
    | ScaleOrdinal<number, string, string | null>
    | ScaleSequential<string, string | null>
    | ScaleThreshold<number | Date, string | null>;
}
