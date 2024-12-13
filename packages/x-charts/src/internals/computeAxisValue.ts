import { scaleBand, scalePoint, scaleTime } from '@mui/x-charts-vendor/d3-scale';
import { AxisConfig, ScaleName } from '../models';
import {
  ChartsXAxisProps,
  ChartsAxisProps,
  ChartsYAxisProps,
  isBandScaleConfig,
  isPointScaleConfig,
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
} from '../models/axis';
import { CartesianChartSeriesType } from '../models/seriesType/config';
import { getColorScale, getOrdinalColorScale } from './colorScale';
import { getTickNumber } from '../hooks/useTicks';
import { getScale } from './getScale';
import { DrawingAreaState } from '../context/DrawingAreaProvider';
import { FormattedSeries } from '../context/SeriesProvider';
import { zoomScaleRange } from '../context/CartesianProvider/zoom';
import { ExtremumGetter } from '../context/PluginProvider';
import {
  DefaultizedAxisConfig,
  ZoomData,
  ZoomOptions,
  GetZoomAxisFilters,
} from '../context/CartesianProvider/Cartesian.types';
import { getAxisExtremum } from '../context/CartesianProvider/getAxisExtremum';

function getRange(
  drawingArea: DrawingAreaState,
  axisDirection: 'x' | 'y' | 'radius' | 'rotation',
  axis: AxisConfig<
    ScaleName,
    any,
    ChartsRotationAxisProps | ChartsRotationAxisProps | ChartsAxisProps
  >,
): [number, number] {
  if (axisDirection === 'rotation') {
    const { startAngle = 0, endAngle = startAngle + 360 } = axis as AxisConfig<
      ScaleName,
      any,
      ChartsRotationAxisProps
    >;
    return axis.reverse
      ? [(Math.PI * startAngle) / 180, (Math.PI * endAngle) / 180]
      : [(Math.PI * endAngle) / 180, (Math.PI * startAngle) / 180];
  }
  if (axisDirection === 'radius') {
    const { minRadius = 0, maxRadius = Math.min(drawingArea.width, drawingArea.height) / 2 } =
      axis as AxisConfig<ScaleName, any, ChartsRadiusAxisProps>;
    return [minRadius, maxRadius];
  }

  const range: [number, number] =
    axisDirection === 'x'
      ? [drawingArea.left, drawingArea.left + drawingArea.width]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

  return axis.reverse ? [range[1], range[0]] : range;
}

const isDateData = (data?: any[]): data is Date[] => data?.[0] instanceof Date;

function createDateFormatter(
  axis: AxisConfig<'band' | 'point', any, ChartsAxisProps>,
  range: number[],
): AxisConfig<'band' | 'point', any, ChartsAxisProps>['valueFormatter'] {
  const timeScale = scaleTime(axis.data!, range);

  return (v, { location }) =>
    location === 'tick' ? timeScale.tickFormat(axis.tickNumber)(v) : `${v.toLocaleString()}`;
}

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

type ComputeResult<T extends ChartsAxisProps> = {
  axis: DefaultizedAxisConfig<T>;
  axisIds: string[];
};

type ComputeCommonParams = {
  drawingArea: DrawingAreaState;
  formattedSeries: FormattedSeries;
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> };
  zoomData?: ZoomData[];
  zoomOptions?: ZoomOptions;
  getFilters?: GetZoomAxisFilters;
};

export function computeAxisValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsYAxisProps>[];
    axisDirection: 'y';
  },
): ComputeResult<ChartsYAxisProps>;
export function computeAxisValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsXAxisProps>[];
    axisDirection: 'x';
  },
): ComputeResult<ChartsAxisProps>;
export function computeAxisValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsRadiusAxisProps>[];
    axisDirection: 'radius';
  },
): ComputeResult<ChartsRadiusAxisProps>;
export function computeAxisValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
    axisDirection: 'rotation';
  },
): ComputeResult<ChartsRotationAxisProps>;
export function computeAxisValue({
  drawingArea,
  formattedSeries,
  axis: allAxis,
  extremumGetters,
  axisDirection,
  zoomData,
  zoomOptions,
  getFilters,
}: ComputeCommonParams & {
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>[];
  axisDirection: 'x' | 'y' | 'radius' | 'rotation';
}) {
  const completeAxis: DefaultizedAxisConfig<ChartsAxisProps> = {};
  allAxis.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis as Readonly<AxisConfig<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const zoomOption = zoomOptions?.[axis.id];
    const zoom = zoomData?.find(({ axisId }) => axisId === axis.id);
    const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
    const range = getRange(drawingArea, axisDirection, axis);

    const [minData, maxData] = getAxisExtremum(
      axis,
      extremumGetters,
      axisIndex,
      formattedSeries,
      zoom === undefined && !zoomOption ? getFilters : undefined, // Do not apply filtering if zoom is already defined.
    );
    const data = axis.data ?? [];

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

      completeAxis[axis.id] = {
        categoryGapRatio,
        barGapRatio,
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
    const tickNumber = rawTickNumber / ((zoomRange[1] - zoomRange[0]) / 100);

    const zoomedRange = zoomScaleRange(range, zoomRange);

    const scale = getScale(scaleType, axisExtremums, zoomedRange);
    const finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
    const [minDomain, maxDomain] = finalScale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

    completeAxis[axis.id] = {
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
