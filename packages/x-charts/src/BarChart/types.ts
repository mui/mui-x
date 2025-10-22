import type { BarSeriesType } from '../models';
import type { SeriesId } from '../models/seriesType/common';
import { RangeBarValueType } from '../models/seriesType/rangeBar';

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
  barLabel?: BarSeriesType['barLabel'];
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
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
}

export interface ProcessedRangeBarSeriesData {
  seriesId: SeriesId;
  data: ProcessedRangeBarData[];
}

export interface ProcessedRangeBarData extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: RangeBarValueType | null;
}
