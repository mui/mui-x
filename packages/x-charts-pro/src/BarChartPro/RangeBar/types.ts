import type { SeriesId } from '@mui/x-charts/models';
import { RangeBarValueType } from '@mui/x-charts/internals';
import type { BarSeriesType } from '../../models';

export interface LayoutData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProcessedRangeBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedRangeBarData[];
  layout: BarSeriesType['layout'];
  yOrigin: number;
  xOrigin: number;
}

export interface ProcessedRangeBarData extends LayoutData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: RangeBarValueType | null;
}
