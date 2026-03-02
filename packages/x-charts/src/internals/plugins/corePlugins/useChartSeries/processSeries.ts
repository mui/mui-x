import { type ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type AllSeriesType } from '../../../../models/seriesType';
import { type ChartSeriesType, type DatasetType } from '../../../../models/seriesType/config';
import { type ChartSeriesConfig, type SeriesProcessorParams } from '../useChartSeriesConfig';
import {
  type DefaultizedSeriesGroups,
  type ProcessedSeries,
  type SeriesIdToType,
  type SeriesLayout,
} from './useChartSeries.types';
import type { IsItemVisibleFunction } from '../../featurePlugins/useChartVisibilityManager';

/**
 * This method groups series by type and adds defaultized values such as the ids and colors.
 * It does NOT apply the series processors - that happens in a selector.
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type with default values.
 */
export const defaultizeSeries = <TSeriesType extends ChartSeriesType>({
  series,
  colors,
  seriesConfig,
}: {
  series: Readonly<AllSeriesType<TSeriesType>[]>;
  colors: readonly string[];
  seriesConfig: ChartSeriesConfig<TSeriesType>;
}): {
  defaultizedSeries: DefaultizedSeriesGroups<TSeriesType>;
  idToType: SeriesIdToType;
} => {
  // Group series by type
  const seriesGroups: { [type in ChartSeriesType]?: SeriesProcessorParams<type> | undefined } = {};
  const idToType = new Map<SeriesId, ChartSeriesType>();

  series.forEach(<T extends TSeriesType>(seriesData: AllSeriesType<T>, seriesIndex: number) => {
    const seriesWithDefaultValues = seriesConfig[seriesData.type as T].getSeriesWithDefaultValues(
      seriesData,
      seriesIndex,
      colors,
    );

    const id: SeriesId = seriesWithDefaultValues.id;

    if (seriesGroups[seriesData.type] === undefined) {
      seriesGroups[seriesData.type] = { series: {}, seriesOrder: [] };
    }

    if (seriesGroups[seriesData.type]?.series[id] !== undefined) {
      throw new Error(`MUI X Charts: series' id "${id}" is not unique.`);
    }

    seriesGroups[seriesData.type]!.series[id] = seriesWithDefaultValues;
    seriesGroups[seriesData.type]!.seriesOrder.push(id);
    if (idToType.has(id)) {
      throw new Error(`MUI X Charts: series' id "${id}" is not unique.`);
    }
    idToType.set(id, seriesData.type);
  });

  return { defaultizedSeries: seriesGroups, idToType };
};

/**
 * Applies series processors to the defaultized series groups.
 * This should be called in a selector to compute processed series on-demand.
 * @param defaultizedSeries The defaultized series groups
 * @param seriesConfig The series configuration
 * @param dataset The optional dataset
 * @returns Processed series with all transformations applied
 */
export const applySeriesProcessors = <TSeriesType extends ChartSeriesType>(
  defaultizedSeries: DefaultizedSeriesGroups<TSeriesType>,
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  dataset?: Readonly<DatasetType>,
  isItemVisible?: IsItemVisibleFunction,
): ProcessedSeries<TSeriesType> => {
  const processedSeries: ProcessedSeries<TSeriesType> = {};

  // Apply formatter on a type group
  (Object.keys(seriesConfig) as TSeriesType[]).forEach((type) => {
    const group = defaultizedSeries[type];
    if (group !== undefined) {
      processedSeries[type] =
        seriesConfig[type]?.seriesProcessor?.(group, dataset, isItemVisible) ?? group;
    }
  });

  return processedSeries;
};

/**
 * Applies series processors with drawing area to series if defined.
 * @param processedSeries The processed series groups
 * @param seriesConfig The series configuration
 * @param drawingArea The drawing area
 * @returns Processed series with all transformations applied
 */
export const applySeriesLayout = <TSeriesType extends ChartSeriesType>(
  processedSeries: ProcessedSeries<TSeriesType>,
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  drawingArea: ChartDrawingArea,
): SeriesLayout<TSeriesType> => {
  let processingDetected = false;
  const seriesLayout: SeriesLayout<TSeriesType> = {};

  // Apply processors on series type per group
  (Object.keys(processedSeries) as TSeriesType[]).forEach((type) => {
    const processor = seriesConfig[type]?.seriesLayout;
    const thisSeries = processedSeries[type];
    if (processor !== undefined && thisSeries !== undefined) {
      const newValue = processor(thisSeries, drawingArea);

      if (newValue && newValue !== processedSeries[type]) {
        processingDetected = true;
        seriesLayout[type] = newValue;
      }
    }
  });

  if (!processingDetected) {
    return {};
  }
  return seriesLayout;
};
