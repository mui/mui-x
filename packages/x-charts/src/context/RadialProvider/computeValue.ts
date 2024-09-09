import { scaleBand, scalePoint, scaleTime } from '@mui/x-charts-vendor/d3-scale';
import { AxisConfig, ScaleName } from '../../models';
import { ChartsAxisProps, isBandScaleConfig, isPointScaleConfig } from '../../models/axis';
import { CartesianChartSeriesType } from '../../models/seriesType/config';
import { getColorScale, getOrdinalColorScale } from '../../internals/colorScale';
import { getTickNumber } from '../../hooks/useTicks';
import { getScale } from '../../internals/getScale';
import { DrawingArea } from '../DrawingProvider';
import { FormattedSeries } from '../SeriesProvider';
import { ExtremumGetter } from '../PluginProvider';
import { DefaultizedAxisConfig } from './Radial.types';
import { getAxisExtremum } from './getAxisExtremum';

const getRange = (
  drawingArea: DrawingArea,
  axisDirection: 'radius' | 'rotation',
  isReverse?: boolean,
) => {
  if (axisDirection === 'rotation') {
    return isReverse ? [0, Math.PI * 2] : [Math.PI * 2, 0];
  }
  return [0, Math.min(drawingArea.width, drawingArea.height) / 2];
};

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

type ComputeResult = {
  axis: DefaultizedAxisConfig;
  axisIds: string[];
};

type ComputeCommonParams = {
  drawingArea: DrawingArea;
  formattedSeries: FormattedSeries;
  extremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> };
};

export function computeValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsAxisProps>[];
    axisDirection: 'radius';
  },
): ComputeResult;
export function computeValue(
  options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsAxisProps>[];
    axisDirection: 'rotation';
  },
): ComputeResult;
export function computeValue({
  drawingArea,
  formattedSeries,
  axis: allAxis,
  extremumGetters,
  axisDirection,
}: ComputeCommonParams & {
  axis: AxisConfig<ScaleName, any, ChartsAxisProps>[];
  axisDirection: 'radius' | 'rotation';
}) {
  const completeAxis: DefaultizedAxisConfig = {};
  allAxis.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis as Readonly<AxisConfig<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const isDefaultAxis = axisIndex === 0;

    const range = getRange(drawingArea, axisDirection, axis.reverse);

    const [minData, maxData] = getAxisExtremum(
      axis,
      extremumGetters,
      isDefaultAxis,
      formattedSeries,
    );
    const data = axis.data ?? [];

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;

      completeAxis[axis.id] = {
        categoryGapRatio,
        barGapRatio,
        ...axis,
        data,
        scale: scaleBand(axis.data!, [
          range[0],
          range[1] - (range[1] - range[0]) / axis.data!.length,
        ])
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
        const dateFormatter = createDateFormatter(axis, range);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (isPointScaleConfig(axis)) {
      completeAxis[axis.id] = {
        ...axis,
        data,
        scale: scalePoint(axis.data!, [
          range[0],
          range[1] - (range[1] - range[0]) / axis.data!.length,
        ]),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, range);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }

    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }

    const scaleType = axis.scaleType ?? ('linear' as const);

    const axisExtremums = [axis.min ?? minData, axis.max ?? maxData];
    const rawTickNumber = getTickNumber({ ...axis, range, domain: axisExtremums });
    const tickNumber = rawTickNumber / ((range[1] - range[0]) / 100);

    const scale = getScale(scaleType, axisExtremums, range).nice(rawTickNumber);
    const [minDomain, maxDomain] = scale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

    completeAxis[axis.id] = {
      ...axis,
      data,
      scaleType: scaleType as any,
      scale: scale.domain(domain) as any,
      tickNumber,
      colorScale: axis.colorMap && getColorScale(axis.colorMap),
    };
  });
  return {
    axis: completeAxis,
    axisIds: allAxis.map(({ id }) => id),
  };
}
