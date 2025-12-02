import { DefaultizedProps } from '@mui/x-internals/types';
import { RangeBarSeriesType, SeriesId } from '@mui/x-charts/models';
import { CommonDefaultizedProps } from '@mui/x-charts/internals';

/**
 * An object that allows to identify a range bar.
 * Used for item interaction
 */
export type RangeBarItemIdentifier = {
  type: 'rangeBar';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedRangeBarSeriesType
  extends DefaultizedProps<RangeBarSeriesType, CommonDefaultizedProps | 'color' | 'layout'> {}
