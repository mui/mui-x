import type {
  AllSeriesType,
  HighlightItemIdentifier,
  HighlightItemIdentifierWithType,
  SeriesItemIdentifier,
  SeriesItemIdentifierWithType,
} from '../../../../models/seriesType';
import { type ChartsColorPalette } from '../../../../colorPalettes';
import { type ChartPluginSignature } from '../../models';
import {
  type ChartSeriesType,
  type ChartSeriesDefaultized,
  type DatasetType,
} from '../../../../models/seriesType/config';
import { type SeriesId } from '../../../../models/seriesType/common';
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
 * Context passed to a series sampler.
 *
 * Sampling is intentionally decoupled from the live (continuously-changing) axis scale and from
 * the pan position: it operates on the whole series in data space and is driven by a quantized
 * `zoomLevel`. This keeps the sampled set stable while panning and during sub-level zooming, so
 * the rendered shape does not flicker. The plot hooks still position the kept points with the live
 * scale, so zoom and pan stay smooth.
 */
export type ChartSeriesSamplerContext = {
  /**
   * The chart drawing area, used to derive the base number of rendered points.
   */
  drawingArea: ChartDrawingArea;
  /**
   * The quantized zoom level: `0` when not zoomed, increasing by one roughly every 2x zoom. The
   * target point count doubles with each level, so detail is added in discrete steps rather than
   * continuously. The level (not the live scale) drives the downsampling, which is what keeps the
   * sampled shape stable while panning.
   */
  zoomLevel: number;
  /**
   * The x-axis data array. Samplers read whichever axis they are indexed along: line and vertical
   * bar series sample along x, so they use this.
   */
  xData: readonly (number | Date | string)[] | undefined;
  /**
   * The y-axis data array. Horizontal bar series are indexed along y, so they sample along this.
   */
  yData: readonly (number | Date | string)[] | undefined;
};

/**
 * A function that computes the sorted subset of original data indices to render for a series.
 * @param {ChartSeriesDefaultized<SeriesType>} series The processed series to downsample.
 * @param {ChartSeriesSamplerContext} context The geometry needed to map data values to pixels.
 * @returns {number[] | null} The indices to render, or `null` to leave the series unsampled.
 */
export type ChartSeriesSampler<SeriesType extends ChartSeriesType = ChartSeriesType> = (
  series: ChartSeriesDefaultized<SeriesType>,
  context: ChartSeriesSamplerContext,
) => number[] | null;

/**
 * The registry of samplers per series type, populated by the Pro sampling plugin.
 */
export type ChartSeriesSamplers = Partial<{
  [SeriesType in ChartSeriesType]: ChartSeriesSampler<SeriesType>;
}>;

export interface UseChartSeriesState<SeriesType extends ChartSeriesType = ChartSeriesType> {
  series: {
    defaultizedSeries: DefaultizedSeriesGroups<SeriesType>;
    idToType: SeriesIdToType;
    dataset?: Readonly<DatasetType>;
  };
  /**
   * @ignore - state populated by the useChartProSampling plugin of the Pro package.
   * When absent (community, or no Pro sampling plugin) the rendered-series selector is an identity
   * passthrough, leaving rendering unchanged.
   */
  sampling?: {
    samplers: ChartSeriesSamplers;
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
