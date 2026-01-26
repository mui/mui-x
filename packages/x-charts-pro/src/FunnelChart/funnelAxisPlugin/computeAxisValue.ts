import { type ChartsAxisProps } from '@mui/x-charts/ChartsAxis';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import {
  type ComputedAxisConfig,
  type ChartSeriesType,
  type ProcessedSeries,
  type ChartSeriesConfig,
  type DefaultedYAxis,
  type DefaultedXAxis,
  type DefaultedAxis,
  type CartesianChartSeriesType,
  type AxisId,
  getAxisExtrema,
  isBandScaleConfig,
  isPointScaleConfig,
  isContinuousScaleConfig,
  getScale,
  getColorScale,
  getOrdinalColorScale,
  getTickNumber,
  scaleTickNumberByRange,
  getCartesianAxisTriggerTooltip,
  isDateData,
  createDateFormatter,
  getDefaultTickNumber,
  scaleBand,
} from '@mui/x-charts/internals';
import {
  type AxisConfig,
  type ChartsXAxisProps,
  type ChartsYAxisProps,
  type ScaleName,
} from '@mui/x-charts/models';

export const xRangeGetter = (
  drawingArea: ChartDrawingArea,
  reverse?: boolean,
  removedSpace: number = 0,
): [number, number] => {
  const range: [number, number] = [
    drawingArea.left,
    drawingArea.left + drawingArea.width - removedSpace,
  ];
  return reverse ? [range[1], range[0]] : [range[0], range[1]];
};

export const yRangeGetter = (
  drawingArea: ChartDrawingArea,
  reverse?: boolean,
  removedSpace: number = 0,
): [number, number] => {
  const range: [number, number] = [
    drawingArea.top + drawingArea.height - removedSpace,
    drawingArea.top,
  ];
  return reverse ? [range[1], range[0]] : [range[0], range[1]];
};

function getRange(
  drawingArea: ChartDrawingArea,
  axisDirection: 'x' | 'y',
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>,
  removedSpace: number = 0,
): [number, number] {
  return axisDirection === 'x'
    ? xRangeGetter(drawingArea, axis.reverse, removedSpace)
    : yRangeGetter(drawingArea, axis.reverse, removedSpace);
}

export type ComputeResult<T extends ChartsAxisProps> = {
  axis: ComputedAxisConfig<T>;
  axisIds: string[];
};

type ComputeCommonParams<T extends ChartSeriesType = 'funnel'> = {
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
  gap: number;
  autoSizes?: Record<AxisId, number>;
};

export function computeAxisValue(
  options: ComputeCommonParams<'funnel'> & {
    axis?: DefaultedYAxis[];
    axisDirection: 'y';
  },
): ComputeResult<ChartsYAxisProps>;
export function computeAxisValue(
  options: ComputeCommonParams<'funnel'> & {
    axis?: DefaultedXAxis[];
    axisDirection: 'x';
  },
): ComputeResult<ChartsXAxisProps>;
export function computeAxisValue({
  drawingArea,
  formattedSeries,
  axis: allAxis,
  seriesConfig,
  axisDirection,
  gap,
  autoSizes,
}: ComputeCommonParams<'funnel'> & {
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
    let range = getRange(drawingArea, axisDirection, axis);

    const [minData, maxData] = getAxisExtrema(
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
      const rangeSpace = Math.abs(range[1] - range[0]);

      const N = axis.data!.length;
      const bandWidth = (rangeSpace - gap * (N - 1)) / N;
      const step = bandWidth + gap;

      // Get axis size, resolving 'auto' to computed value from autoSizes
      const axisSize =
        axisDirection === 'x' ? (axis as DefaultedXAxis).height : (axis as DefaultedYAxis).width;
      const resolvedSize = axisSize === 'auto' ? (autoSizes?.[axis.id] ?? 0) : (axisSize ?? 0);

      completeAxis[axis.id] = {
        offset: 0,
        categoryGapRatio: 0,
        barGapRatio: 0,
        triggerTooltip,
        ...axis,
        // Set height/width as a number (resolved from 'auto' if needed)
        ...(axisDirection === 'x' ? { height: resolvedSize } : { width: resolvedSize }),
        data,
        scale: scaleBand(axis.data!, scaleRange)
          .paddingInner(gap / step)
          .paddingOuter(0),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      } as ComputedAxisConfig<ChartsAxisProps>[typeof axis.id];

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis.data, scaleRange, axis.tickNumber);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }

    if (isBandScaleConfig(axis)) {
      return;
    }

    if (isPointScaleConfig(axis)) {
      throw new Error(
        'Point scale is not supported in FunnelChart. Please use band scale instead.',
      );
    }

    if (isContinuousScaleConfig(axis)) {
      const isHorizontal = Object.values(formattedSeries.funnel?.series ?? {}).some(
        (s) => s.layout === 'horizontal',
      );
      if (isHorizontal ? axisDirection === 'x' : axisDirection === 'y') {
        // For linear scale replacing the band scale, we remove the space needed for gap from the scale range.
        const itemNumber =
          formattedSeries.funnel?.series[formattedSeries.funnel.seriesOrder[0]].data.length ?? 0;
        const spaceToRemove = gap * (itemNumber - 1);
        range = getRange(drawingArea, axisDirection, axis, spaceToRemove);
      }

      const scaleType = axis.scaleType ?? ('linear' as const);

      const domainLimit = axis.domainLimit ?? 'nice';
      const axisExtremums = [axis.min ?? minData, axis.max ?? maxData];

      if (typeof domainLimit === 'function') {
        const { min, max } = domainLimit(minData, maxData);
        axisExtremums[0] = min;
        axisExtremums[1] = max;
      }

      const rawTickNumber = getTickNumber(
        axis,
        axisExtremums,
        getDefaultTickNumber(Math.abs(range[1] - range[0])),
      );
      const tickNumber = scaleTickNumberByRange(rawTickNumber, range);

      const scale = getScale(scaleType, axisExtremums, range);
      const finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
      const [minDomain, maxDomain] = finalScale.domain();
      const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

      // Get axis size, resolving 'auto' to computed value from autoSizes
      const axisSize =
        axisDirection === 'x' ? (axis as DefaultedXAxis).height : (axis as DefaultedYAxis).width;
      const resolvedSize = axisSize === 'auto' ? (autoSizes?.[axis.id] ?? 0) : (axisSize ?? 0);

      completeAxis[axis.id] = {
        offset: 0,
        triggerTooltip,
        ...axis,
        // Set height/width as a number (resolved from 'auto' if needed)
        ...(axisDirection === 'x' ? { height: resolvedSize } : { width: resolvedSize }),
        data,
        scaleType: scaleType as any,
        scale: finalScale.domain(domain) as any,
        tickNumber,
        colorScale: axis.colorMap && getColorScale(axis.colorMap),
      } as ComputedAxisConfig<ChartsAxisProps>[typeof axis.id];
    }
  });
  return {
    axis: completeAxis,
    axisIds: allAxis.map(({ id }) => id),
  };
}
