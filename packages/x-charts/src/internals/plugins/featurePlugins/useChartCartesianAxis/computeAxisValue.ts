import { type ScaleBand, type NumberValue } from '@mui/x-charts-vendor/d3-scale';
import { createScalarFormatter } from '../../../defaultValueFormatters';
import { type ContinuousScaleName, type ScaleName } from '../../../../models';
import {
  type ChartsXAxisProps,
  type ChartsAxisProps,
  type ChartsYAxisProps,
  isBandScaleConfig,
  isPointScaleConfig,
  type AxisId,
  type DefaultedXAxis,
  type DefaultedYAxis,
  type DefaultedAxis,
  type AxisValueFormatterContext,
  type ComputedAxis,
  type D3Scale,
} from '../../../../models/axis';
import {
  type CartesianChartSeriesType,
  type ChartSeriesType,
} from '../../../../models/seriesType/config';
import { getColorScale, getOrdinalColorScale, getSequentialColorScale } from '../../../colorScale';
import { scaleTickNumberByRange } from '../../../ticks';
import { getScale } from '../../../getScale';
import { isDateData, createDateFormatter } from '../../../dateHelpers';
import type { ChartDrawingArea } from '../../../../hooks';
import { type ChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import { type ComputedAxisConfig } from './useChartCartesianAxis.types';
import { type ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { type ZoomData } from './zoom.types';
import { getAxisTriggerTooltip } from './getAxisTriggerTooltip';
import { isBandScale, isOrdinalScale } from '../../../scaleGuards';

function getRange(
  drawingArea: ChartDrawingArea,
  axisDirection: 'x' | 'y', // | 'rotation' | 'radius',
  reverse: boolean,
): [number, number] {
  const range: [number, number] =
    axisDirection === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return reverse ? [range[1], range[0]] : range;
}

function shouldIgnoreGapRatios(scale: ScaleBand<{ toString(): string }>, categoryGapRatio: number) {
  const step = scale.step();

  const paddingPx = step * categoryGapRatio;

  /* If the padding is less than 0.1px, we consider it negligible and ignore it.
   * This prevents issues where very small gaps cause rendering artifacts or unexpected layouts.
   * A threshold of 0.1px is chosen as it's generally below the perceptible limit for most displays.
   */
  return paddingPx < 0.1;
}

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

export type ComputeResult<T extends ChartsAxisProps> = {
  axis: ComputedAxisConfig<T>;
  axisIds: AxisId[];
};

type ComputeCommonParams<T extends ChartSeriesType = ChartSeriesType> = {
  scales: Record<AxisId, D3Scale>;
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
  zoomMap?: Map<AxisId, ZoomData>;
  domains: Record<
    AxisId,
    {
      domain: ReadonlyArray<string | NumberValue>;
      tickNumber?: number;
    }
  >;
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
  scales,
  drawingArea,
  formattedSeries,
  axis: allAxis,
  seriesConfig,
  axisDirection,
  zoomMap,
  domains,
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

  const axisIdsTriggeringTooltip = getAxisTriggerTooltip(
    axisDirection,
    seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
    formattedSeries,
    allAxis[0].id,
  );

  const completeAxis: ComputedAxisConfig<ChartsAxisProps> = {};
  allAxis.forEach((eachAxis) => {
    const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const scale = scales[axis.id];
    const zoom = zoomMap?.get(axis.id);
    const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
    const range = getRange(drawingArea, axisDirection, axis.reverse ?? false);

    const rawTickNumber = domains[axis.id].tickNumber!;

    const triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);
    const tickNumber = scaleTickNumberByRange(rawTickNumber, zoomRange);

    const data = axis.data ?? [];

    if (isOrdinalScale(scale)) {
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;

      if (isBandScale(scale) && isBandScaleConfig(axis)) {
        const desiredCategoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        const ignoreGapRatios = shouldIgnoreGapRatios(scale, desiredCategoryGapRatio);
        const categoryGapRatio = ignoreGapRatios ? 0 : desiredCategoryGapRatio;
        const barGapRatio = ignoreGapRatios ? 0 : (axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO);

        completeAxis[axis.id] = {
          offset: 0,
          height: 0,
          categoryGapRatio,
          barGapRatio,
          triggerTooltip,
          ...axis,
          data,
          /* Doing this here is technically wrong, but acceptable in practice.
           * In theory, this should be done in the normalized scale selector, but then we'd need that selector to depend
           * on the zoom range, which would void its goal (which is to be independent of zoom).
           * Since we only ignore gap ratios when they're practically invisible, the small errors caused by this
           * discrepancy will hopefully not be noticeable. */
          scale: ignoreGapRatios ? scale.copy().padding(0) : scale,
          tickNumber,
          colorScale:
            axis.colorMap &&
            (axis.colorMap.type === 'ordinal'
              ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
              : getColorScale(axis.colorMap)),
        };
      }

      if (isPointScaleConfig(axis)) {
        completeAxis[axis.id] = {
          offset: 0,
          height: 0,
          triggerTooltip,
          ...axis,
          data,
          scale,
          tickNumber,
          colorScale:
            axis.colorMap &&
            (axis.colorMap.type === 'ordinal'
              ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
              : getColorScale(axis.colorMap)),
        };
      }

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis.data, scaleRange, axis.tickNumber);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }

      return;
    }

    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }

    const continuousAxis = axis as Readonly<
      DefaultedAxis<ContinuousScaleName, any, Readonly<ChartsAxisProps>>
    >;
    const scaleType = continuousAxis.scaleType ?? ('linear' as const);

    completeAxis[axis.id] = {
      offset: 0,
      height: 0,
      triggerTooltip,
      ...continuousAxis,
      data,
      scaleType,
      scale,
      tickNumber,
      colorScale: continuousAxis.colorMap && getSequentialColorScale(continuousAxis.colorMap),
      valueFormatter:
        axis.valueFormatter ??
        (createScalarFormatter(
          tickNumber,
          getScale(
            scaleType as ContinuousScaleName,
            range.map((v) => scale.invert(v)),
            range,
          ),
        ) as <TScaleName extends ScaleName>(
          value: any,
          context: AxisValueFormatterContext<TScaleName>,
        ) => string),
    } as ComputedAxis<ContinuousScaleName, any, ChartsAxisProps>;
  });

  return {
    axis: completeAxis,
    axisIds: allAxis.map(({ id }) => id),
  };
}
