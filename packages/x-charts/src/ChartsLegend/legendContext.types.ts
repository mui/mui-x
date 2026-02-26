import { type ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
import { type PieItemId } from '../models';
import { type SeriesId } from '../models/seriesType/common';
import type { ChartSeriesType } from '../models/seriesType/config';

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
  extends
    Partial<Omit<SeriesLegendItemContext, 'type' | keyof LegendItemContextBase>>,
    Partial<Omit<PiecewiseColorLegendItemContext, 'type' | keyof LegendItemContextBase>>,
    LegendItemContextBase {
  /**
   * The type of the series
   */
  type: ChartSeriesType;
  markType: ChartsLabelMarkProps['type'];
}

export interface SeriesLegendItemParams
  extends
    Partial<Omit<SeriesLegendItemContext, 'type' | keyof LegendItemContextBase>>,
    LegendItemContextBase {
  /**
   * The identifier of the series
   */
  seriesId: SeriesId;
  /**
   * The type of the series
   */
  type: ChartSeriesType;
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
   * @deprecated use `dataIndex` instead
   */
  itemId?: PieItemId;
  /**
   * The data index of the item in the series data array
   */
  dataIndex?: number;
}

export interface PiecewiseColorLegendItemContext extends LegendItemContextBase {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
   */
  type: 'piecewiseColor';
  /**
   * The minimum value of the category
   */
  minValue: number | Date | null;
  /**
   * The maximum value of the category
   */
  maxValue: number | Date | null;
}

export type LegendItemContext = SeriesLegendItemContext | PiecewiseColorLegendItemContext;
