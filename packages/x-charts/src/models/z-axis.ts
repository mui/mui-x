import type { ScaleOrdinal, ScaleSequential, ScaleThreshold } from '@mui/x-charts-vendor/d3-scale';
import {
  type ContinuousColorConfig,
  type OrdinalColorConfig,
  type PiecewiseColorConfig,
} from './colorMapping';
import { type DatasetElementType } from './seriesType/config';

export interface ZAxisConfig<V = any> {
  id: string;
  data?: readonly V[];
  /**
   * The key used to retrieve `data` from the `dataset` prop.
   */
  dataKey?: string;
  /**
   * A function to extract and transform the value from the `dataset` item.
   * It receives the full dataset item and should return the axis value.
   * Can be used as an alternative to `dataKey`.
   * @param {DatasetElementType<unknown>} item The full dataset item.
   * @returns {V} The transformed value.
   */
  valueGetter?: (item: DatasetElementType<unknown>) => V;
  /**
   * The minimal value of the scale.
   */
  min?: number;
  /**
   * The maximal value of the scale.
   */
  max?: number;
  colorMap?: OrdinalColorConfig | ContinuousColorConfig | PiecewiseColorConfig;
}

export interface ZAxisDefaultized extends ZAxisConfig {
  colorScale?:
    | ScaleOrdinal<string | number | Date, string, string | null>
    | ScaleOrdinal<number, string, string | null>
    | ScaleSequential<string, string | null>
    | ScaleThreshold<number | Date, string | null>;
}
