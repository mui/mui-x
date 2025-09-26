import { scaleBand, scalePoint, type ScaleSymLog } from '@mui/x-charts-vendor/d3-scale';
import {
  AxisConfig,
  AxisId,
  ChartsAxisProps,
  ContinuousScaleName,
  D3ContinuousScale,
  D3OrdinalScale,
  DefaultedAxis,
  isBandScaleConfig,
  isPointScaleConfig,
  isSymlogScaleConfig,
  ScaleName,
} from '../../../../models/axis';
import { CartesianChartSeriesType, ChartSeriesType } from '../../../../models/seriesType/config';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';
import { ChartSeriesConfig } from '../../models';
import { ZoomData } from './zoom.types';
import { zoomScaleRange } from './zoom';
import { getAxisDomainLimit } from './getAxisDomainLimit';
import { getTickNumber } from '../../../ticks';
import { getScale } from '../../../getScale';
import { getAxisExtrema } from './getAxisExtrema';
import { ChartDrawingArea } from '../../../../hooks/useDrawingArea';

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;

type GetAxesScalesParams<T extends ChartSeriesType = ChartSeriesType> = {
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
  zoomMap?: Map<AxisId, ZoomData>;
  /**
   * @deprecated To remove in v9. This is an experimental feature to avoid breaking change.
   */
  preferStrictDomainInLineCharts?: boolean;
};

function getRange(
  drawingArea: ChartDrawingArea,
  axisDirection: 'x' | 'y',
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>,
): [number, number] {
  const range: [number, number] =
    axisDirection === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return axis.reverse ? [range[1], range[0]] : range;
}

export function getXAxesScales<T extends ChartSeriesType>({
  drawingArea,
  formattedSeries,
  axis: axes = [],
  seriesConfig,
  zoomMap,
  preferStrictDomainInLineCharts,
}: GetAxesScalesParams<T> & {
  axis?: DefaultedAxis[];
}) {
  const scales: Record<AxisId, ScaleDefinition> = {};

  axes.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const zoom = zoomMap?.get(axis.id);

    scales[axis.id] = getAxisScale(
      axis,
      'x',
      zoom,
      drawingArea,
      seriesConfig,
      axisIndex,
      formattedSeries,
      preferStrictDomainInLineCharts,
    );
  });

  return scales;
}

export function getYAxesScales<T extends ChartSeriesType>({
  drawingArea,
  formattedSeries,
  axis: axes = [],
  seriesConfig,
  zoomMap,
  preferStrictDomainInLineCharts,
}: GetAxesScalesParams<T> & {
  axis?: DefaultedAxis[];
}) {
  const scales: Record<AxisId, ScaleDefinition> = {};

  axes.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const zoom = zoomMap?.get(axis.id);

    scales[axis.id] = getAxisScale(
      axis,
      'y',
      zoom,
      drawingArea,
      seriesConfig,
      axisIndex,
      formattedSeries,
      preferStrictDomainInLineCharts,
    );
  });

  return scales;
}

export type ScaleDefinition =
  | {
      scale: D3ContinuousScale;
      tickNumber: number;
    }
  | {
      scale: D3OrdinalScale;
      tickNumber?: never;
    };

function getAxisScale<T extends ChartSeriesType>(
  axis: Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>,
  axisDirection: 'x' | 'y',
  zoom: ZoomData | undefined,
  drawingArea: ChartDrawingArea,
  seriesConfig: ChartSeriesConfig<T>,
  axisIndex: number,
  formattedSeries: ProcessedSeries<T>,
  /**
   * @deprecated To remove in v9. This is an experimental feature to avoid breaking change.
   */
  preferStrictDomainInLineCharts: boolean | undefined,
): ScaleDefinition {
  const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
  const range = getRange(drawingArea, axisDirection, axis);

  if (isBandScaleConfig(axis)) {
    const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
    // Reverse range because ordinal scales are presented from top to bottom on y-axis
    const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
    const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

    return {
      scale: scaleBand(axis.data!, zoomedRange)
        .paddingInner(categoryGapRatio)
        .paddingOuter(categoryGapRatio / 2),
    };
  }

  if (isPointScaleConfig(axis)) {
    const scaleRange = axisDirection === 'y' ? [...range].reverse() : range;
    const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

    return { scale: scalePoint(axis.data!, zoomedRange) };
  }

  const scaleType = axis.scaleType ?? ('linear' as const);

  const domainLimit = getDomainLimit(
    axis,
    axisDirection,
    axisIndex,
    formattedSeries,
    preferStrictDomainInLineCharts,
  );

  const [minData, maxData] = getAxisExtrema(
    axis,
    axisDirection,
    seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
    axisIndex,
    formattedSeries,
  );
  const axisExtrema = getActualAxisExtrema(axis, minData, maxData);

  if (typeof domainLimit === 'function') {
    const { min, max } = domainLimit(minData, maxData);
    axisExtrema[0] = min;
    axisExtrema[1] = max;
  }

  const rawTickNumber = getTickNumber({ ...axis, range, domain: axisExtrema });

  const zoomedRange = zoomScaleRange(range, zoomRange);

  const scale = getScale(scaleType as ContinuousScaleName, axisExtrema, zoomedRange);

  if (isSymlogScaleConfig(axis) && axis.constant != null) {
    (scale as ScaleSymLog<number, number>).constant(axis.constant);
  }

  applyDomainLimit(scale, axis, domainLimit, rawTickNumber);

  return { scale, tickNumber: rawTickNumber };
}

type DomainLimit = 'nice' | 'strict' | ((min: number, max: number) => { min: number; max: number });

export function getDomainLimit(
  axis: Pick<DefaultedAxis, 'id' | 'domainLimit'>,
  axisDirection: 'x' | 'y',
  axisIndex: number,
  formattedSeries: ProcessedSeries,
  preferStrictDomainInLineCharts: boolean | undefined,
) {
  return preferStrictDomainInLineCharts
    ? getAxisDomainLimit(axis, axisDirection, axisIndex, formattedSeries)
    : (axis.domainLimit ?? 'nice');
}

export function applyDomainLimit(
  scale: D3ContinuousScale,
  axis: { min?: number | Date; max?: number | Date },
  domainLimit: DomainLimit,
  rawTickNumber: number,
) {
  if (domainLimit === 'nice') {
    scale.nice(rawTickNumber);
  }

  const [minDomain, maxDomain] = scale.domain();
  scale.domain([axis.min ?? minDomain, axis.max ?? maxDomain]);
}

/**
 * Get the actual axis extrema considering the user defined min and max values.
 * @param axisExtrema User defined axis extrema.
 * @param minData Minimum value from the data.
 * @param maxData Maximum value from the data.
 */
export function getActualAxisExtrema(
  axisExtrema: Pick<AxisConfig, 'min' | 'max'>,
  minData: number,
  maxData: number,
): [number | Date, number | Date] {
  let min: number | Date = minData;
  let max: number | Date = maxData;

  if (axisExtrema.max != null && axisExtrema.max.valueOf() < minData) {
    min = axisExtrema.max;
  }

  if (axisExtrema.min != null && axisExtrema.min.valueOf() > minData) {
    max = axisExtrema.min;
  }

  return [axisExtrema.min ?? min, axisExtrema.max ?? max];
}
