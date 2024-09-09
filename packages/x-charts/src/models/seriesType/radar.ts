import { DefaultizedProps } from '../helpers';
import { CommonDefaultizedProps, CommonSeriesType, SeriesId } from './common';

export interface RadarSeriesType extends CommonSeriesType<number> {
  type: 'radar';
  data: number[];
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
