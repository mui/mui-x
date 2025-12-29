import {
  type CartesianSeriesType,
  type CommonDefaultizedProps,
  type CommonSeriesType,
  type SeriesId,
} from '@mui/x-charts/internals';
import { type DefaultizedProps } from '@mui/x-internals/types';

/** [start, end] */
export type RangeBarValueType = [number, number];

export interface RangeBarSeriesType
  extends CommonSeriesType<RangeBarValueType | null>, CartesianSeriesType {
  type: 'rangeBar';
  /**
   * Data associated to each range bar.
   */
  data?: ReadonlyArray<RangeBarValueType | null>;
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
}

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
> {}
