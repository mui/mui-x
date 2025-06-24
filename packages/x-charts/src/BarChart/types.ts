import type { BarSeriesType } from '../models';
import type { SeriesId } from '../models/seriesType/common';

export type AnimationData = {
  x: number;
  y: number;
  width: number;
  height: number;
  yOrigin: number;
  xOrigin: number;
  layout: BarSeriesType['layout'];
};

export interface ProcessedBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedBarData[];
}

export interface ProcessedBarData extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: number | null;
  maskId: string;
  stackId?: string;
}

export interface MaskData extends AnimationData {
  id: string;
  hasNegative: boolean;
  hasPositive: boolean;
}
