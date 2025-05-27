import { scaleBand, scalePoint } from '@mui/x-charts-vendor/d3-scale';
import { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import {
  ComputedAxisConfig,
  ChartSeriesType,
  ProcessedSeries,
  ChartSeriesConfig,
  AxisId,
  ZoomData,
  DefaultizedZoomOptions,
  GetZoomAxisFilters,
  DefaultedYAxis,
  DefaultedXAxis,
  DefaultedAxis,
  CartesianChartSeriesType,
  getAxisExtremum,
  isBandScaleConfig,
  isPointScaleConfig,
  getScale,
  getColorScale,
  getOrdinalColorScale,
  getTickNumber,
  scaleTickNumberByRange,
  getCartesianAxisTriggerTooltip,
  isDateData,
  createDateFormatter,
} from '@mui/x-charts/internals';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '@mui/x-charts/models';

function getRange(
  drawingArea: ChartDrawingArea,
  axisDirection: 'x' | 'y', // | 'rotation' | 'radius',
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>,
): [number, number] {
  const range: [number, number] =
    axisDirection === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return axis.reverse ? [range[1], range[0]] : range;
}

export type ComputeResult<T extends ChartsAxisProps> = {
  axis: ComputedAxisConfig<T>;
  axisIds: string[];
};

type ComputeCommonParams<T extends ChartSeriesType = ChartSeriesType> = {
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
  zoomMap?: Map<AxisId, ZoomData>;
  zoomOptions?: Record<AxisId, DefaultizedZoomOptions>;
  getFilters?: GetZoomAxisFilters;
};

export function computeAxisValue<T extends ChartSeriesType>(
  options: ComputeCommonParams<T> & {
    axis?: DefaultedYAxis[];
    axisDirection: 'y';
  },
): ComputeResult<ChartsYAxisProps>;
export function computeAxisValue<T extends ChartSeriesType>(
  options: ComputeCommonParams<T> & {
    axis?: DefaultedXAxis[];
    axisDirection: 'x';
  },
): ComputeResult<ChartsXAxisProps>;
export function computeAxisValue<T extends ChartSeriesType>({
  drawingArea,
  formattedSeries,
  axis: allAxis,
  seriesConfig,
  axisDirection,
  zoomMap,
  zoomOptions,
  getFilters,
}: ComputeCommonParams<T> & {
  axis?: DefaultedAxis[];
  axisDirection: 'x' | 'y';
}) {
  if (allAxis === undefined) {
    return {
      axis: {},
      axisIds: [],
    };
  }

  const axisIdsTriggeringTooltip = getCartesianAxisTriggerTooltip(
    axisDirection,
    seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
    formattedSeries,
    allAxis[0].id,
  );

  const completeAxis: ComputedAxisConfig<ChartsAxisProps> = {};
  allAxis.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const zoomOption = zoomOptions?.[axis.id];
    const zoom = zoomMap?.get(axis.id);
    const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
    const range = getRange(drawingArea, axisDirection, axis);

    const [minData, maxData] = getAxisExtremum(
      axis,
      axisDirection,
      seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
      axisIndex,
      formattedSeries,
      zoom === undefined && !zoomOption ? getFilters : undefined, // Do not apply filtering if zoom is already defined.
    );

    const triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);

    const data = axis.data ?? [];

    if (isBandScaleConfig(axis)) {
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
      const zoomedRange = scaleRange;

      completeAxis[axis.id] = {
        offset: 0,
        height: 0,
        categoryGapRatio: 0,
        barGapRatio: 0,
        triggerTooltip,
        ...axis,
        data,
        scale: scaleBand(axis.data!, zoomedRange),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, scaleRange);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (isPointScaleConfig(axis)) {
      const scaleRange = axisDirection === 'y' ? [...range].reverse() : range;
      const zoomedRange = scaleRange;

      completeAxis[axis.id] = {
        offset: 0,
        height: 0,
        triggerTooltip,
        ...axis,
        data,
        scale: scalePoint(axis.data!, zoomedRange),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, scaleRange);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }

    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }

    const scaleType = axis.scaleType ?? ('linear' as const);

    const domainLimit = axis.domainLimit ?? 'nice';

    const axisExtremums = [axis.min ?? minData, axis.max ?? maxData];

    if (typeof domainLimit === 'function') {
      const { min, max } = domainLimit(minData, maxData);
      axisExtremums[0] = min;
      axisExtremums[1] = max;
    }

    const rawTickNumber = getTickNumber({ ...axis, range, domain: axisExtremums });
    const tickNumber = scaleTickNumberByRange(rawTickNumber, zoomRange);

    const zoomedRange = range;

    const scale = getScale(scaleType, axisExtremums, zoomedRange);
    const finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
    const [minDomain, maxDomain] = finalScale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

    completeAxis[axis.id] = {
      offset: 0,
      height: 0,
      triggerTooltip,
      ...axis,
      data,
      scaleType: scaleType as any,
      scale: finalScale.domain(domain) as any,
      tickNumber,
      colorScale: axis.colorMap && getColorScale(axis.colorMap),
    };
  });
  return {
    axis: completeAxis,
    axisIds: allAxis.map(({ id }) => id),
  };
}
