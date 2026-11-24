import type { SeriesId } from '@mui/x-charts/models';
import type { BarSeriesType } from '@mui/x-charts-pro/models';
import type { RangeBarSeriesType, RangeBarValueType } from '../../models';

export interface LayoutData {
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * The coordinate of the range start on the value axis.
   * It is the y-coordinate for vertical layout and the x-coordinate for horizontal layout.
   */
  startCoordinate: number;
}

export interface ProcessedRangeBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedRangeBarData[];
  layout: BarSeriesType['layout'];
  barLabel?: RangeBarSeriesType['barLabel'];
  barLabelPlacement?: RangeBarSeriesType['barLabelPlacement'];
  yOrigin: number;
  xOrigin: number;
}

export interface ProcessedRangeBarData extends LayoutData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: RangeBarValueType | null;
  hidden: boolean;
}
