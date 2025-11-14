import type { SeriesId } from '@mui/x-charts/models';
import { RangeBarValueType } from '@mui/x-charts/models';
import type { BarSeriesType } from '../../models';

export interface ProcessedRangeBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedRangeBarData[];
}

export interface ProcessedRangeBarData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: RangeBarValueType | null;

  x: number;
  y: number;
  width: number;
  height: number;
  yOrigin: number;
  xOrigin: number;
  layout: BarSeriesType['layout'];
}
