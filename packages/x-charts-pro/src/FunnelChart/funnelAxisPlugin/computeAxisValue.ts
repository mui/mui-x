import { scaleBand } from '@mui/x-charts-vendor/d3-scale';
import { ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { ChartDrawingArea } from '@mui/x-charts/hooks';
import {
  ComputedAxisConfig,
  ChartSeriesType,
  ProcessedSeries,
  ChartSeriesConfig,
  DefaultedYAxis,
  DefaultedXAxis,
  DefaultedAxis,
  CartesianChartSeriesType,
  getAxisExtremum,
  isBandScaleConfig,
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

export const xRangeGetter = (
  drawingArea: ChartDrawingArea,
  gap: number,
  reverse?: boolean,
): [number, number] => {
  const range: [number, number] = [drawingArea.left, drawingArea.left + drawingArea.width];
  return reverse ? [range[1] + gap, range[0] - gap] : [range[0] - gap, range[1] + gap];
};

export const yRangeGetter = (
  drawingArea: ChartDrawingArea,
  gap: number,
  reverse?: boolean,
): [number, number] => {
  const range: [number, number] = [drawingArea.top + drawingArea.height, drawingArea.top];
  return reverse ? [range[1] - gap, range[0] + gap] : [range[0] + gap, range[1] - gap];
};

function getRange(
  drawingArea: ChartDrawingArea,
  axisDirection: 'x' | 'y',
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>,
  gap: number,
): [number, number] {
  gap /= 2;
  return axisDirection === 'x'
    ? xRangeGetter(drawingArea, gap, axis.reverse)
    : yRangeGetter(drawingArea, gap, axis.reverse);
}

export type ComputeResult<T extends ChartsAxisProps> = {
  axis: ComputedAxisConfig<T>;
  axisIds: string[];
};

type ComputeCommonParams<T extends ChartSeriesType = ChartSeriesType> = {
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
  gap: number;
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
  gap,
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
    const range = getRange(drawingArea, axisDirection, axis, gap);

    const [minData, maxData] = getAxisExtremum(
      axis,
      axisDirection,
      seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
      axisIndex,
      formattedSeries,
    );

    const triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);

    const data = axis.data ?? [];

    if (isBandScaleConfig(axis)) {
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;

      completeAxis[axis.id] = {
        offset: 0,
        height: 0,
        categoryGapRatio: 0,
        barGapRatio: 0,
        triggerTooltip,
        ...axis,
        data,
        scale: scaleBand(axis.data!, scaleRange),
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

    if (axis.scaleType === 'band') {
      return;
    }

    if (axis.scaleType === 'point') {
      throw new Error(
        'Point scale is not supported in FunnelChart. Please use band scale instead.',
      );
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
    const tickNumber = scaleTickNumberByRange(rawTickNumber, range);

    const scale = getScale(scaleType, axisExtremums, range);
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
