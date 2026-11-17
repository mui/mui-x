import type {
  CartesianSeriesType,
  CommonDefaultizedProps,
  CommonSeriesType,
  SeriesId,
  DatasetElementType,
} from '@mui/x-charts/internals';
import type { DefaultizedProps } from '@mui/x-internals/types';
import type { BarLabelContext } from '@mui/x-charts/BarChart';

/** [start, end] */
export type RangeBarValueType = [number, number];

export interface RangeBarSeriesType extends CommonSeriesType<'rangeBar'>, CartesianSeriesType {
  type: 'rangeBar';
  /**
   * Data associated to each range bar.
   */
  data?: ReadonlyArray<RangeBarValueType | null>;
  /**
   * A function to transform the dataset item into a range bar value.
   * @param {DatasetElementType} item The full dataset item.
   * @returns {RangeBarValueType | null} The transformed value.
   */
  valueGetter?: (item: DatasetElementType<unknown>) => RangeBarValueType | null;
  /**
   * The keys used to retrieve data from the dataset. Must be provided if the `dataset` prop is used.
   */
  datasetKeys?: {
    /**
     * The key used to retrieve the start of the range from the dataset.
     */
    start: string;
    /**
     * The key used to retrieve the end of the range from the dataset.
     */
    end: string;
  };
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * Layout of the bars. All bars should have the same layout.
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the range as `start – end`.
   * @param {RangeBarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel?:
    'value' | ((item: RangeBarItem, context: BarLabelContext) => string | null | undefined);
  /**
   * The placement of the bar label. It accepts the following values:
   * - 'center': the label is centered on the bar
   * - 'outside': the label is placed after the end of the range, from the point of view of its start. For a vertical bar whose end is greater than its start, the label is above its top edge.
   * @default 'center'
   */
  barLabelPlacement?: 'center' | 'outside';
}

export type RangeBarItem = {
  /**
   * The series id of the range bar.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The value of the data point.
   */
  value: RangeBarValueType | null;
};

/**
 * An object that allows to identify a range bar.
 * Used for item interaction
 */
export type RangeBarItemIdentifier = {
  type: 'rangeBar';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedRangeBarSeriesType extends DefaultizedProps<
  RangeBarSeriesType,
  CommonDefaultizedProps | 'color' | 'layout'
> {
  hidden: boolean;
}
