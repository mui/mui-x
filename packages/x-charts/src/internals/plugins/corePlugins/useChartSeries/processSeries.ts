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
export const defaultizeSeries = <SeriesType extends ChartSeriesType>({
  series,
  colors,
  theme,
  seriesConfig,
}: {
  series: Readonly<AllSeriesType<SeriesType>[]>;
  colors: readonly string[];
  theme: 'light' | 'dark';
  seriesConfig: ChartSeriesConfig<SeriesType>;
}): {
  defaultizedSeries: DefaultizedSeriesGroups<SeriesType>;
  idToType: SeriesIdToType;
} => {
  // Group series by type
  const seriesGroups: { [type in ChartSeriesType]?: SeriesProcessorParams<type> | undefined } = {};
  const idToType = new Map<SeriesId, ChartSeriesType>();

  series.forEach(<T extends SeriesType>(seriesData: AllSeriesType<T>, seriesIndex: number) => {
    const seriesWithDefaultValues = seriesConfig[seriesData.type as T].getSeriesWithDefaultValues(
      seriesData,
      seriesIndex,
      colors,
      theme,
    );

    const id: SeriesId = seriesWithDefaultValues.id;

    if (seriesGroups[seriesData.type] === undefined) {
      seriesGroups[seriesData.type] = { series: {}, seriesOrder: [] };
    }

    if (seriesGroups[seriesData.type]?.series[id] !== undefined) {
      throw new Error(
        `MUI X Charts: Series id "${id}" is not unique. ` +
          'Each series must have a unique id to be properly identified and rendered. ' +
          'Provide a unique id for each series in your chart configuration.',
      );
    }

    seriesGroups[seriesData.type]!.series[id] = seriesWithDefaultValues;
    seriesGroups[seriesData.type]!.seriesOrder.push(id);
    if (idToType.has(id)) {
      throw new Error(
        `MUI X Charts: Series id "${id}" is not unique across series types. ` +
          'Each series must have a unique id even across different series types. ' +
          'Provide a unique id for each series in your chart configuration.',
      );
    }
    idToType.set(id, seriesData.type);
  });

  return { defaultizedSeries: seriesGroups, idToType };
};

const isThenable = (value: unknown): value is Promise<unknown> =>
  value != null &&
  (typeof value === 'object' || typeof value === 'function') &&
  typeof (value as { then?: unknown }).then === 'function';

/**
 * Raw output of the series processors before async results are settled.
 * Each type maps either to a settled result or to a Promise resolving to one.
 */
export type RawProcessedSeries<SeriesType extends ChartSeriesType = ChartSeriesType> = {
  [type in SeriesType]?:
    | SeriesProcessorResultOf<type>
    | Promise<SeriesProcessorResultOf<type>>;
};

type SeriesProcessorResultOf<SeriesType extends ChartSeriesType> = NonNullable<
  ProcessedSeries<SeriesType>[SeriesType]
>;

/**
 * Runs every series processor once. A processor may return its result directly
 * (synchronous) or a Promise (asynchronous). No awaiting happens here so this
 * stays usable from `getInitialState`.
 * @param defaultizedSeries The defaultized series groups
 * @param seriesConfig The series configuration
 * @param dataset The optional dataset
 * @returns A map of type to settled result or pending Promise.
 */
export const runSeriesProcessors = <SeriesType extends ChartSeriesType>(
  defaultizedSeries: DefaultizedSeriesGroups<SeriesType>,
  seriesConfig: ChartSeriesConfig<SeriesType>,
  dataset?: Readonly<DatasetType>,
  isItemVisible?: IsItemVisibleFunction,
): RawProcessedSeries<SeriesType> => {
  const raw: RawProcessedSeries<SeriesType> = {};

  (Object.keys(seriesConfig) as SeriesType[]).forEach((type) => {
    const group = defaultizedSeries[type];
    if (group !== undefined) {
      raw[type] = (seriesConfig[type]?.seriesProcessor?.(group, dataset, isItemVisible) ??
        group) as RawProcessedSeries<SeriesType>[SeriesType];
    }
  });

  return raw;
};

/**
 * Whether any processor returned a Promise (i.e. needs awaiting).
 */
export const hasAsyncProcessedSeries = <SeriesType extends ChartSeriesType>(
  raw: RawProcessedSeries<SeriesType>,
): boolean => (Object.keys(raw) as SeriesType[]).some((type) => isThenable(raw[type]));

/**
 * Extracts only the synchronously available results. Async types are omitted so
 * that the synchronous render path (e.g. `getInitialState`) keeps working while
 * async results are still pending. Falls back to the provided value when given.
 */
export const pickSettledProcessedSeries = <SeriesType extends ChartSeriesType>(
  raw: RawProcessedSeries<SeriesType>,
  fallback?: ProcessedSeries<SeriesType>,
): ProcessedSeries<SeriesType> => {
  const processedSeries: ProcessedSeries<SeriesType> = {};

  (Object.keys(raw) as SeriesType[]).forEach((type) => {
    const value = raw[type];
    if (!isThenable(value)) {
      processedSeries[type] = value as ProcessedSeries<SeriesType>[SeriesType];
    } else if (fallback?.[type] !== undefined) {
      processedSeries[type] = fallback[type];
    }
  });

  return processedSeries;
};

/**
 * Awaits every pending processor and returns the fully settled processed series.
 */
export const resolveProcessedSeries = async <SeriesType extends ChartSeriesType>(
  raw: RawProcessedSeries<SeriesType>,
): Promise<ProcessedSeries<SeriesType>> => {
  const types = Object.keys(raw) as SeriesType[];
  const settled = await Promise.all(types.map((type) => Promise.resolve(raw[type])));

  const processedSeries: ProcessedSeries<SeriesType> = {};
  types.forEach((type, index) => {
    processedSeries[type] = settled[index] as ProcessedSeries<SeriesType>[SeriesType];
  });

  return processedSeries;
};

/**
 * Applies series processors to the defaultized series groups synchronously.
 * Kept for the all-synchronous path; async processor results are dropped here
 * and must be settled through {@link resolveProcessedSeries} instead.
 * @param defaultizedSeries The defaultized series groups
 * @param seriesConfig The series configuration
 * @param dataset The optional dataset
 * @returns Processed series with all synchronous transformations applied
 */
export const applySeriesProcessors = <SeriesType extends ChartSeriesType>(
  defaultizedSeries: DefaultizedSeriesGroups<SeriesType>,
  seriesConfig: ChartSeriesConfig<SeriesType>,
  dataset?: Readonly<DatasetType>,
  isItemVisible?: IsItemVisibleFunction,
): ProcessedSeries<SeriesType> =>
  pickSettledProcessedSeries(
    runSeriesProcessors(defaultizedSeries, seriesConfig, dataset, isItemVisible),
  );

/**
 * Applies series processors with drawing area to series if defined.
 * @param processedSeries The processed series groups
 * @param seriesConfig The series configuration
 * @param drawingArea The drawing area
 * @returns Processed series with all transformations applied
 */
export const applySeriesLayout = <SeriesType extends ChartSeriesType>(
  processedSeries: ProcessedSeries<SeriesType>,
  seriesConfig: ChartSeriesConfig<SeriesType>,
  drawingArea: ChartDrawingArea,
): SeriesLayout<SeriesType> => {
  let processingDetected = false;
  const seriesLayout: SeriesLayout<SeriesType> = {};

  // Apply processors on series type per group
  (Object.keys(processedSeries) as SeriesType[]).forEach((type) => {
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
