import type { SeriesId } from '@mui/x-charts/models';
import { RangeBarValueType } from '@mui/x-charts/models';
import type { BarSeriesType } from '../../models';

export interface LayoutData {
  x: number;
  y: number;
  width: number;
  height: number;
  yOrigin: number;
  xOrigin: number;
  layout: BarSeriesType['layout'];
}

export interface ProcessedRangeBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedRangeBarData[];
}

export interface ProcessedRangeBarData extends LayoutData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: RangeBarValueType | null;
}
