import { scaleBand, scalePoint } from 'd3-scale';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../../constants';
import { AxisConfig, ChartsXAxisProps, ScaleName } from '../../models';
import { ChartsYAxisProps, isBandScaleConfig, isPointScaleConfig } from '../../models/axis';
import { CartesianChartSeriesType, ExtremumGetter } from '../../models/seriesType/config';
import { DefaultizedAxisConfig } from './CartesianContext';
import { getColorScale, getOrdinalColorScale } from '../../internals/colorScale';
import { getTickNumber } from '../../hooks/useTicks';
import { getScale } from '../../internals/getScale';
import { DrawingArea } from '../DrawingProvider';
import { FormattedSeries } from '../SeriesContextProvider';
import { MakeOptional } from '../../models/helpers';
import { getAxisExtremum } from './getAxisExtremum';

const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;

export const computeValue = (
  drawingArea: DrawingArea,
  formattedSeries: FormattedSeries,
  xAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[] | undefined,
  yAxis: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[] | undefined,
  xExtremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> },
  yExtremumGetters: { [K in CartesianChartSeriesType]?: ExtremumGetter<K> },
) => {
  const allXAxis: AxisConfig<ScaleName, any, ChartsXAxisProps>[] = [
    ...(xAxis?.map((axis, index) => ({ id: `defaultized-x-axis-${index}`, ...axis })) ?? []),
    // Allows to specify an axis with id=DEFAULT_X_AXIS_KEY
    ...(xAxis === undefined || xAxis.findIndex(({ id }) => id === DEFAULT_X_AXIS_KEY) === -1
      ? [{ id: DEFAULT_X_AXIS_KEY, scaleType: 'linear' as const }]
      : []),
  ];

  const completedXAxis: DefaultizedAxisConfig<ChartsXAxisProps> = {};
  allXAxis.forEach((axis, axisIndex) => {
    const isDefaultAxis = axisIndex === 0;
    const [minData, maxData] = getAxisExtremum(
      axis,
      xExtremumGetters,
      isDefaultAxis,
      formattedSeries,
    );

    const range = axis.reverse
      ? [drawingArea.left + drawingArea.width, drawingArea.left]
      : [drawingArea.left, drawingArea.left + drawingArea.width];

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
      completedXAxis[axis.id] = {
        categoryGapRatio,
        barGapRatio,
        ...axis,
        scale: scaleBand(axis.data!, range)
          .paddingInner(categoryGapRatio)
          .paddingOuter(categoryGapRatio / 2),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };
    }
    if (isPointScaleConfig(axis)) {
      completedXAxis[axis.id] = {
        ...axis,
        scale: scalePoint(axis.data!, range),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };
    }
    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }

    const scaleType = axis.scaleType ?? ('linear' as const);

    const extremums = [axis.min ?? minData, axis.max ?? maxData];
    const tickNumber = getTickNumber({ ...axis, range, domain: extremums });

    // Gotta remove ".nice" here to avoid jittering in zoom
    const scale = getScale(scaleType, extremums, range);
    const [minDomain, maxDomain] = scale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

    completedXAxis[axis.id] = {
      ...axis,
      scaleType: scaleType as any,
      scale: scale.domain(domain) as any,
      tickNumber,
      colorScale: axis.colorMap && getColorScale(axis.colorMap),
    };
  });

  const allYAxis: AxisConfig<ScaleName, any, ChartsYAxisProps>[] = [
    ...(yAxis?.map((axis, index) => ({ id: `defaultized-y-axis-${index}`, ...axis })) ?? []),
    ...(yAxis === undefined || yAxis.findIndex(({ id }) => id === DEFAULT_Y_AXIS_KEY) === -1
      ? [{ id: DEFAULT_Y_AXIS_KEY, scaleType: 'linear' as const }]
      : []),
  ];

  const completedYAxis: DefaultizedAxisConfig<ChartsYAxisProps> = {};
  allYAxis.forEach((axis, axisIndex) => {
    const isDefaultAxis = axisIndex === 0;
    const [minData, maxData] = getAxisExtremum(
      axis,
      yExtremumGetters,
      isDefaultAxis,
      formattedSeries,
    );
    const range = axis.reverse
      ? [drawingArea.top, drawingArea.top + drawingArea.height]
      : [drawingArea.top + drawingArea.height, drawingArea.top];

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      completedYAxis[axis.id] = {
        categoryGapRatio,
        barGapRatio: 0,
        ...axis,
        scale: scaleBand(axis.data!, [range[1], range[0]])
          .paddingInner(categoryGapRatio)
          .paddingOuter(categoryGapRatio / 2),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };
    }
    if (isPointScaleConfig(axis)) {
      completedYAxis[axis.id] = {
        ...axis,
        scale: scalePoint(axis.data!, [range[1], range[0]]),
        tickNumber: axis.data!.length,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal'
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(axis.colorMap)),
      };
    }
    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }

    const scaleType = axis.scaleType ?? ('linear' as const);

    const extremums = [axis.min ?? minData, axis.max ?? maxData];
    const tickNumber = getTickNumber({ ...axis, range, domain: extremums });

    // Gotta remove ".nice" here to avoid jittering in zoom
    const scale = getScale(scaleType, extremums, range);
    const [minDomain, maxDomain] = scale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

    completedYAxis[axis.id] = {
      ...axis,
      scaleType: scaleType as any,
      scale: scale.domain(domain) as any,
      tickNumber,
      colorScale: axis.colorMap && getColorScale(axis.colorMap),
    };
  });

  return {
    isInitialized: true,
    data: {
      xAxis: completedXAxis,
      yAxis: completedYAxis,
      xAxisIds: allXAxis.map(({ id }) => id),
      yAxisIds: allYAxis.map(({ id }) => id),
    },
  };
};
