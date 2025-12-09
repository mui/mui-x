import type { BarSeriesType } from '../models';
import type { SeriesId } from '../models/seriesType/common';

export type AnimationData = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface ProcessedBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedBarData[];
  barLabel?: BarSeriesType['barLabel'];
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
  layout: 'vertical' | 'horizontal';
  xOrigin: number;
  yOrigin: number;
}

export interface ProcessedBarData extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: number | null;
  maskId: string;
}

export interface MaskData extends AnimationData {
  id: string;
  hasNegative: boolean;
  hasPositive: boolean;
  xOrigin: number;
  yOrigin: number;
  layout: 'horizontal' | 'vertical';
}
