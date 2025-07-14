import { scaleBand, scalePoint } from '@mui/x-charts-vendor/d3-scale';
import { createScalarFormatter } from '../../../defaultValueFormatters';
import { AxisConfig, ScaleName } from '../../../../models';
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
} from '../../../../models/axis';
import { CartesianChartSeriesType, ChartSeriesType } from '../../../../models/seriesType/config';
import { getColorScale, getOrdinalColorScale } from '../../../colorScale';
import { getTickNumber, scaleTickNumberByRange } from '../../../ticks';
import { getScale } from '../../../getScale';
import { isDateData, createDateFormatter } from '../../../dateHelpers';
import { zoomScaleRange } from './zoom';
import { getAxisExtremum } from './getAxisExtremum';
import type { ChartDrawingArea } from '../../../../hooks';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import { ComputedAxisConfig, DefaultizedZoomOptions } from './useChartCartesianAxis.types';
import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { GetZoomAxisFilters, ZoomData } from './zoom.types';
import { getAxisTriggerTooltip } from './getAxisTriggerTooltip';
import { getAxisDomainLimit } from './getAxisDomainLimit';

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

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

export type ComputeResult<T extends ChartsAxisProps> = {
  axis: ComputedAxisConfig<T>;
  axisIds: AxisId[];
};

type ComputeCommonParams<T extends ChartSeriesType = ChartSeriesType> = {
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
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

      completeAxis[axis.id] = {
        offset: 0,
        height: 0,
        categoryGapRatio,
        barGapRatio,
        triggerTooltip,
        ...axis,
        data,
        scale: scaleBand(axis.data!, zoomedRange)
          .paddingInner(categoryGapRatio)
          .paddingOuter(categoryGapRatio / 2),
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
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

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

    const domainLimit = preferStrictDomainInLineCharts
      ? getAxisDomainLimit(axis, axisDirection, axisIndex, formattedSeries)
      : (axis.domainLimit ?? 'nice');

    const axisExtremums = [axis.min ?? minData, axis.max ?? maxData];

    if (typeof domainLimit === 'function') {
      const { min, max } = domainLimit(minData, maxData);
      axisExtremums[0] = min;
      axisExtremums[1] = max;
    }

    const rawTickNumber = getTickNumber({ ...axis, range, domain: axisExtremums });
    const tickNumber = scaleTickNumberByRange(rawTickNumber, zoomRange);

    const zoomedRange = zoomScaleRange(range, zoomRange);

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
      valueFormatter:
        axis.valueFormatter ??
        (createScalarFormatter(
          tickNumber,
          getScale(
            scaleType,
            range.map((v) => scale.invert(v)),
            range,
          ),
        ) as <TScaleName extends ScaleName>(
          value: any,
          context: AxisValueFormatterContext<TScaleName>,
        ) => string),
    };
  });
  return {
    axis: completeAxis,
    axisIds: allAxis.map(({ id }) => id),
  };
}
