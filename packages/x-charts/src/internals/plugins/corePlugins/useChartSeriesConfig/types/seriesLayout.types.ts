import type { ChartSeriesType, ChartSeriesLayout } from '../../../../../models/seriesType/config';
import { type ChartDrawingArea } from '../../../../../hooks/useDrawingArea';
import type { SeriesId } from '../../../../../models/seriesType/common';
import { type SeriesProcessorResult } from './seriesProcessor.types';

export type SeriesLayoutGetterResult<SeriesType extends ChartSeriesType> = Record<
  SeriesId,
  ChartSeriesLayout<SeriesType>
>;

export type SeriesLayoutGetter<SeriesType extends ChartSeriesType> = (
  params: SeriesProcessorResult<SeriesType>,
  drawingArea: Readonly<ChartDrawingArea>,
) => SeriesLayoutGetterResult<SeriesType>;
