import { createScalarFormatter } from '../../../defaultValueFormatters';
import { ContinuousScaleName, ScaleName } from '../../../../models';
import {
  ChartsXAxisProps,
  ChartsAxisProps,
  ChartsYAxisProps,
  isBandScaleConfig,
  isPointScaleConfig,
  AxisId,
  DefaultedXAxis,
  DefaultedYAxis,
  DefaultedAxis,
  AxisValueFormatterContext,
  ComputedAxis,
} from '../../../../models/axis';
import { CartesianChartSeriesType, ChartSeriesType } from '../../../../models/seriesType/config';
import { getColorScale, getOrdinalColorScale, getSequentialColorScale } from '../../../colorScale';
import { scaleTickNumberByRange } from '../../../ticks';
import { getScale } from '../../../getScale';
import { isDateData, createDateFormatter } from '../../../dateHelpers';
import { getAxisExtrema } from './getAxisExtrema';
import type { ChartDrawingArea } from '../../../../hooks';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import { ComputedAxisConfig, DefaultizedZoomOptions } from './useChartCartesianAxis.types';
import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { GetZoomAxisFilters, ZoomData } from './zoom.types';
import { getAxisTriggerTooltip } from './getAxisTriggerTooltip';
import { applyDomainLimit, getDomainLimit, ScaleDefinition } from './getAxisScale';
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

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

export type ComputeResult<T extends ChartsAxisProps> = {
  axis: ComputedAxisConfig<T>;
  axisIds: AxisId[];
};

type ComputeCommonParams<T extends ChartSeriesType = ChartSeriesType> = {
  scales: Record<AxisId, ScaleDefinition>;
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
  zoomMap?: Map<AxisId, ZoomData>;
  zoomOptions?: Record<AxisId, DefaultizedZoomOptions>;
  getFilters?: GetZoomAxisFilters;
  /**
   * @deprecated To remove in v9. This is an experimental feature to avoid breaking change.
   */
  preferStrictDomainInLineCharts?: boolean;
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
  zoomOptions,
  getFilters,
  preferStrictDomainInLineCharts,
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
  allAxis.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const scaleDefinition = scales[axis.id];
    let scale = scaleDefinition.scale;
    const zoomOption = zoomOptions?.[axis.id];
    const zoom = zoomMap?.get(axis.id);
    const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
    const range = getRange(drawingArea, axisDirection, axis.reverse ?? false);

    const triggerTooltip = !axis.ignoreTooltip && axisIdsTriggeringTooltip.has(axis.id);

    const data = axis.data ?? [];

    if (isOrdinalScale(scale)) {
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;

      if (isBandScale(scale) && isBandScaleConfig(axis)) {
        const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
        const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;

        completeAxis[axis.id] = {
          offset: 0,
          height: 0,
          categoryGapRatio,
          barGapRatio,
          triggerTooltip,
          ...axis,
          data,
          scale,
          tickNumber: axis.data!.length,
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
          tickNumber: axis.data!.length,
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

    const rawTickNumber = scaleDefinition.tickNumber!;
    const continuousAxis = axis as Readonly<
      DefaultedAxis<ContinuousScaleName, any, Readonly<ChartsAxisProps>>
    >;
    const scaleType = continuousAxis.scaleType ?? ('linear' as const);
    const tickNumber = scaleTickNumberByRange(rawTickNumber, zoomRange);

    const filter = zoom === undefined && !zoomOption ? getFilters : undefined; // Do not apply filtering if zoom is already defined.
    if (filter) {
      const [minData, maxData] = getAxisExtrema(
        axis,
        axisDirection,
        seriesConfig as ChartSeriesConfig<CartesianChartSeriesType>,
        axisIndex,
        formattedSeries,
        filter,
      );
      scale = scale.copy();
      scale.domain([minData, maxData]);

      const domainLimit = getDomainLimit(
        axis,
        axisDirection,
        axisIndex,
        formattedSeries,
        preferStrictDomainInLineCharts,
      );

      const axisExtrema = [axis.min ?? minData, axis.max ?? maxData];

      if (typeof domainLimit === 'function') {
        const { min, max } = domainLimit(minData, maxData);
        axisExtrema[0] = min;
        axisExtrema[1] = max;
      }

      scale.domain(axisExtrema);
      applyDomainLimit(scale, axis, domainLimit, rawTickNumber);
    }

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
