import { DefaultizedProps } from '@mui/x-internals/types';
import { CommonDefaultizedProps, CommonSeriesType, SeriesId } from './common';

export interface RadarSeriesType extends CommonSeriesType<number> {
  type: 'radar';
  data: number[];
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * If `true` hide marks at value position.
   */
  hideMark?: boolean;
  /**
   * If `true` fill the series area.
   */
  fillArea?: boolean;
}

/**
 * An object that allows to identify either a radar series or a radar point (if dataIndex is defined).
 * Used for item interaction
 */
export type RadarItemIdentifier = {
  type: 'radar';
  seriesId: SeriesId;
  dataIndex?: number;
};

export interface DefaultizedRadarSeriesType
  extends DefaultizedProps<RadarSeriesType, CommonDefaultizedProps | 'color'> {}
