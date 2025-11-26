import type {
  ChartSeriesType,
  ChartSeriesWithPosition,
  ChartsSeriesConfig,
} from '../../../../models/seriesType/config';
import { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import type { SeriesId } from '../../../../models/seriesType/common';
import type { StackingGroupsType } from '../../../stackSeries';
import { SeriesProcessorResult } from './seriesProcessor.types';

export type SeriesPositionsParams<TSeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartsSeriesConfig[TSeriesType]['seriesInput']>;
  seriesOrder: SeriesId[];
};

export type SeriesPositionsResult<TSeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesWithPosition<TSeriesType>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[TSeriesType] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

export type SeriesPositions<TSeriesType extends ChartSeriesType> = (
  params: SeriesProcessorResult<TSeriesType>,
  drawingArea: Readonly<ChartDrawingArea>,
) => SeriesPositionsResult<TSeriesType>;
