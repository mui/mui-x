import type { ChartSeriesType, ChartSeriesLayout } from '../../../../../models/seriesType/config';
import { type ChartDrawingArea } from '../../../../../hooks/useDrawingArea';
import type { SeriesId } from '../../../../../models/seriesType/common';
import { type SeriesProcessorResult } from './seriesProcessor.types';

export type SeriesLayoutGetterResult<TSeriesType extends ChartSeriesType> = Record<
  SeriesId,
  ChartSeriesLayout<TSeriesType>
>;

export type SeriesLayoutGetter<TSeriesType extends ChartSeriesType> = (
  params: SeriesProcessorResult<TSeriesType>,
  drawingArea: Readonly<ChartDrawingArea>,
) => SeriesLayoutGetterResult<TSeriesType>;
