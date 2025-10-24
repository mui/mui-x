import { DefaultizedProps } from '@mui/x-internals/types';
import type { StackOffsetType } from '../stacking';
import {
  CartesianSeriesType,
  CommonDefaultizedProps,
  CommonSeriesType,
  SeriesId,
  StackableSeriesType,
} from './common';
import { CurveType } from '../curve';

export type AreaRangeValueType = {
  start: number;
  end: number;
};

export interface ShowMarkParams<AxisValue = number | Date> {
  /**
   * The item index.
   */
  index: number;
  /**
   * The x coordinate in the SVG.
   */
  x: number;
  /**
   * The y coordinate in the SVG.
   */
  y: number;
  /**
   * The item position value. It likely comes from the axis `data` property.
   */
  position: AxisValue;
  /**
   * The item value. It comes from the series `data` property.
   */
  value: number;
}

export interface AreaRangeSeriesType
  extends CommonSeriesType<AreaRangeValueType | null>,
    CartesianSeriesType,
    StackableSeriesType {
  type: 'areaRange';
  /**
   * Data associated to the area range.
   */
  data?: ReadonlyArray<AreaRangeValueType | null>;
  /**
   * The key used to retrieve data from the dataset.
   */
  dataKey?: string;
  /**
   * The keys used to retrieve data from the dataset.
   *
   * When this prop is provided, both `start` and `end` are mandatory.
   */
  datasetKeys?: {
    /**
     * The key used to retrieve data from the dataset for the start of the area.
     */
    start: string;
    /**
     * The key used to retrieve data from the dataset for the end of the area.
     */
    end: string;
  };
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * The type of curve to use for the line.
   * Read more about curves at [line interpolation](https://mui.com/x/react-charts/lines/#interpolation).
   * TODO: Does this make sense?
   * @default 'monotoneX'
   */
  curve?: CurveType;
  /**
   * If `true`, step curve starts and end at the first and last point.
   * By default the line is extended to fill the space before and after.
   * TODO: Does this make sense?
   */
  strictStepCurve?: boolean;
  /**
   * Define which items of the series should display a mark.
   * If can be a boolean that applies to all items.
   * Or a callback that gets some item properties and returns true if the item should be displayed.
   * TODO: Does this make sense?
   */
  showMark?: boolean | ((params: ShowMarkParams) => boolean);
  /**
   * The shape of the mark elements.
   * Using 'circle' renders a `<circle />` element, while all other options render a `<path />` instead. The path causes a small decrease in performance.
   * TODO: Does this make sense?
   * @default 'circle'
   */
  shape?: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
  /**
   * Do not render the line highlight item if set to `true`.
   *
   * TODO: Does this make sense?
   * @default false
   */
  disableHighlight?: boolean;
  /**
   * If `true`, line and area connect points separated by `null` values.
   * TODO: Does this make sense?
   * @default false
   */
  connectNulls?: boolean;
  /**
   * Defines how stacked series handle negative values.
   * TODO: Does this make sense?
   * @default 'none'
   */
  stackOffset?: StackOffsetType;
}

/**
 * An object that allows to identify a single line.
 * Used for item interaction
 */
export type AreaRangeItemIdentifier = {
  type: 'area-range';
  seriesId: SeriesId;
  /**
   * `dataIndex` can be `undefined` if the mouse is over the area and not a specific item.
   */
  dataIndex?: number;
};

export interface DefaultizedAreaRangeSeriesType
  extends DefaultizedProps<AreaRangeSeriesType, CommonDefaultizedProps | 'color'> {}
