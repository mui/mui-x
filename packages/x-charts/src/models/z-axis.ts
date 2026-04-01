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
   * A function to transform the value retrieved from the `dataset` before using it.
   * @param {unknown} value The raw value from the dataset.
   * @param {DatasetElementType} item The full dataset item.
   * @returns {V} The transformed value.
   */
  valueGetter?: (value: unknown, item: DatasetElementType<unknown>) => V;
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
