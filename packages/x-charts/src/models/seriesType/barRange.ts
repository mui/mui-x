import { DefaultizedProps } from '@mui/x-internals/types';
import { CartesianSeriesType, CommonDefaultizedProps, CommonSeriesType, SeriesId } from './common';

export type BarRangeValueType = {
  start: number;
  end: number;
};

export interface BarRangeSeriesType
  extends CommonSeriesType<BarRangeValueType | null>,
    CartesianSeriesType {
  type: 'barRange';
  /**
   * Data associated to each bar range.
   */
  data?: ReadonlyArray<BarRangeValueType | null>;
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
   * Layout of the bars. All bars should have the same layout.
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical';
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type BarRangeItemIdentifier = {
  type: 'barRange';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedBarRangeSeriesType
  extends DefaultizedProps<BarRangeSeriesType, CommonDefaultizedProps | 'color' | 'layout'> {}
