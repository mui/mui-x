import { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
import { PieItemId } from '../models';
import { SeriesId } from '../models/seriesType/common';

interface LegendItemContextBase {
  /**
   * The color used in the legend
   */
  color: string;
  /**
   * The label displayed in the legend
   */
  label: string;
}

export interface LegendItemParams
  extends Partial<Omit<SeriesLegendItemContext, 'type' | keyof LegendItemContextBase>>,
    LegendItemContextBase {
  /**
   * The identifier of the legend element.
   * Used for internal purpose such as `key` props
   */
  id: number | string;
  markType: ChartsLabelMarkProps['type'];
}

export interface SeriesLegendItemContext extends LegendItemContextBase {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
   */
  type: 'series';
  /**
   * The identifier of the series
   */
  seriesId: SeriesId;
  /**
   * The identifier of the pie item
   */
  itemId?: PieItemId;
}

export type LegendItemContext = SeriesLegendItemContext;
