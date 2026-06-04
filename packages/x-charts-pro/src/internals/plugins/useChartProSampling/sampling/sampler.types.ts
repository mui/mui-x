import type { ChartSeriesType, ChartSeriesDefaultized } from '@mui/x-charts/internals';
import type { ChartDrawingArea } from '@mui/x-charts/hooks';

/**
 * Context passed to a series sampler. Sampling runs over the whole series in data space, driven by
 * the quantized `zoomLevel` rather than the live scale, so the kept set stays stable while panning.
 */
export type ChartSeriesSamplerContext = {
  /**
   * The chart drawing area, used to derive the base number of rendered points.
   */
  drawingArea: ChartDrawingArea;
  /**
   * The quantized zoom level: `0` when not zoomed, +1 roughly every 2x zoom. The target point count
   * doubles with each level, so detail is added in discrete steps.
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
 * The registry of samplers per series type.
 */
export type ChartSeriesSamplers = Partial<{
  [SeriesType in ChartSeriesType]: ChartSeriesSampler<SeriesType>;
}>;
