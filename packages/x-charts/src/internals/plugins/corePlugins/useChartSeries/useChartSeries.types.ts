import type {
  AllSeriesType,
  HighlightItemIdentifier,
  HighlightItemIdentifierWithType,
  SeriesItemIdentifier,
  SeriesItemIdentifierWithType,
} from '../../../../models/seriesType';
import { type ChartsColorPalette } from '../../../../colorPalettes';
import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesType, type DatasetType } from '../../../../models/seriesType/config';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type AxisId } from '../../../../models/axis';
import { type ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import {
  type SeriesLayoutGetterResult,
  type SeriesProcessorParams,
  type SeriesProcessorResult,
  type UseChartSeriesConfigSignature,
} from '../useChartSeriesConfig';
import {
  type VisibilityIdentifier,
  type VisibilityIdentifierWithType,
} from '../../featurePlugins/useChartVisibilityManager/useChartVisibilityManager.types';

export interface UseChartSeriesParameters<SeriesType extends ChartSeriesType = ChartSeriesType> {
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series?: Readonly<AllSeriesType<SeriesType>[]>;
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors?: ChartsColorPalette;
  theme?: 'light' | 'dark';
}

export type UseChartSeriesDefaultizedParameters<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = UseChartSeriesParameters<SeriesType> & {
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: Readonly<AllSeriesType<SeriesType>[]>;
  /**
   * Color palette used to colorize multiple series.
   * @default rainbowSurgePalette
   */
  colors: ChartsColorPalette;
  theme: 'light' | 'dark';
};

export type ProcessedSeries<SeriesType extends ChartSeriesType = ChartSeriesType> = {
  [type in SeriesType]?: SeriesProcessorResult<type>;
};

export type SeriesLayout<SeriesType extends ChartSeriesType = ChartSeriesType> = {
  [type in SeriesType]?: SeriesLayoutGetterResult<type>;
};

export type DefaultizedSeriesGroups<SeriesType extends ChartSeriesType = ChartSeriesType> = {
  [type in SeriesType]?: SeriesProcessorParams<type>;
};

export type SeriesIdToType = ReadonlyMap<SeriesId, ChartSeriesType>;

/**
 * The inputs the sampling computation needs, gathered by the community sampled-indices selector and
 * handed to the Pro `computeSampledIndices` function.
 *
 * Kept to plain data (no live axis scales, no cartesian-plugin types) so the core series plugin
 * state stays free of feature-plugin dependencies. Sampling runs in data space and is driven by the
 * quantized `zoomLevel`, so the rendered shape stays stable while panning.
 */
export interface ChartSampledIndicesInput {
  /**
   * The processed series of every type. The sampler for each series type reads its own group.
   */
  processedSeries: ProcessedSeries;
  /**
   * The chart drawing area, used to derive the base number of rendered points.
   */
  drawingArea: ChartDrawingArea;
  /**
   * The quantized zoom level: `0` when not zoomed, increasing by one roughly every 2x zoom.
   */
  zoomLevel: number;
  /**
   * The x-axis data arrays keyed by axis id, for samplers indexed along x (line, vertical bar).
   */
  xAxisData: Record<AxisId, readonly (number | Date | string)[] | undefined>;
  /**
   * The y-axis data arrays keyed by axis id, for samplers indexed along y (horizontal bar).
   */
  yAxisData: Record<AxisId, readonly (number | Date | string)[] | undefined>;
  /**
   * The default x-axis id, used when a series does not set `xAxisId`.
   */
  defaultXAxisId: AxisId;
  /**
   * The default y-axis id, used when a series does not set `yAxisId`.
   */
  defaultYAxisId: AxisId;
}

/**
 * Computes the render-only sampled indices, keyed by series id. Provided by the Pro sampling plugin;
 * absent in the community package, where nothing is sampled.
 * @param {ChartSampledIndicesInput} input The processed series and geometry to sample against.
 * @returns {Record<SeriesId, number[]>} The indices to render, keyed by series id.
 */
export type ChartSampledIndicesComputer = (
  input: ChartSampledIndicesInput,
) => Record<SeriesId, number[]>;

export interface UseChartSeriesState<SeriesType extends ChartSeriesType = ChartSeriesType> {
  series: {
    defaultizedSeries: DefaultizedSeriesGroups<SeriesType>;
    idToType: SeriesIdToType;
    dataset?: Readonly<DatasetType>;
  };
  /**
   * @ignore - state populated by the useChartProSampling plugin of the Pro package.
   * When absent (community, or no Pro sampling plugin) nothing is sampled and rendering is unchanged.
   */
  sampling?: {
    computeSampledIndices: ChartSampledIndicesComputer;
  };
}

export type IdentifierWithTypeFunction = {
  // Overloads for different identifier types
  <
    SeriesType extends ChartSeriesType,
    Item extends SeriesItemIdentifier<SeriesType> | SeriesItemIdentifierWithType<SeriesType>,
  >(
    identifier: Item,
    typeOfIdentifier: 'seriesItem',
  ): SeriesItemIdentifierWithType<SeriesType>;

  <
    SeriesType extends ChartSeriesType,
    Item extends HighlightItemIdentifier<SeriesType> | HighlightItemIdentifierWithType<SeriesType>,
  >(
    identifier: Item,
    typeOfIdentifier: 'highlightItem',
  ): HighlightItemIdentifierWithType<SeriesType>;

  <
    SeriesType extends ChartSeriesType,
    Item extends VisibilityIdentifier<SeriesType> | VisibilityIdentifierWithType<SeriesType>,
  >(
    identifier: Item,
    typeOfIdentifier: 'visibility',
  ): VisibilityIdentifierWithType<SeriesType>;
};

interface UseChartSeriesInstance {
  /**
   * Utils top add series type when developers do not provide it.
   * @param {Pick<SeriesItemIdentifier<SeriesType>, 'seriesId'>} identifier The series identifier without its type
   * @returns {Pick<SeriesItemIdentifier<SeriesType>, 'seriesId'> & Pick<SeriesItemIdentifier<SeriesType>, 'type'>}The identifier with the type.
   */
  identifierWithType: IdentifierWithTypeFunction;
}

export type UseChartSeriesSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartSeriesParameters;
    defaultizedParams: UseChartSeriesDefaultizedParameters<SeriesType>;
    state: UseChartSeriesState<SeriesType>;
    instance: UseChartSeriesInstance;
    dependencies: [UseChartSeriesConfigSignature<SeriesType>];
  }>;
