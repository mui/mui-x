// This file is here only to fix typing. The full typing of zoom states is defined in the pro library.
import { AxisId } from '../../../../models/axis';
import type { ExtremumFilter } from './useChartCartesianAxis.types';

export type ZoomData = { axisId: AxisId; start: number; end: number };

export type ZoomFilterMode = 'keep' | 'discard';

export interface ZoomOptions {
  filterMode?: ZoomFilterMode;
}

export type ZoomAxisFilters = Record<AxisId, ExtremumFilter>;

export type GetZoomAxisFilters = (params: {
  currentAxisId: AxisId | undefined;
  seriesXAxisId?: AxisId;
  seriesYAxisId?: AxisId;
  isDefaultAxis: boolean;
}) => ExtremumFilter;
