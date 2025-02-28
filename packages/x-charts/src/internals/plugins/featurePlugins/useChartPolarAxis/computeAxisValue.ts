import { scaleBand, scalePoint, scaleTime } from '@mui/x-charts-vendor/d3-scale';
import { AxisConfig, ScaleName } from '../../../../models';
import {
  ChartsAxisProps,
  ChartsYAxisProps,
  isBandScaleConfig,
  isPointScaleConfig,
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
} from '../../../../models/axis';
import { ChartSeriesType, PolarChartSeriesType } from '../../../../models/seriesType/config';
import { getColorScale, getOrdinalColorScale } from '../../../colorScale';
import { getTickNumber } from '../../../../hooks/useTicks';
import { getScale } from '../../../getScale';
import { getAxisExtremum } from './getAxisExtremum';
import type { ChartDrawingArea } from '../../../../hooks';
import { ChartSeriesConfig } from '../../models/seriesConfig';

import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';

import { DefaultizedAxisConfig } from '../useChartCartesianAxis/useChartCartesianAxis.types';

const degreeToRad = (value?: number, defaultRad?: number) => {
  if (value === undefined) {
    return defaultRad!;
  }
  return (Math.PI * value) / 180;
};

type RotationConfig = AxisConfig<ScaleName, any, ChartsRotationAxisProps>;

function getRange(
  drawingArea: ChartDrawingArea,
  axisDirection: 'rotation' | 'radius',
  axis:
    | AxisConfig<'linear', any, ChartsRadiusAxisProps>
    | AxisConfig<ScaleName, any, ChartsRotationAxisProps>,
) {
  if (axisDirection === 'rotation') {
    if (axis.scaleType === 'point') {
      const angles = [
        degreeToRad((axis as RotationConfig).startAngle, 0),
        degreeToRad((axis as RotationConfig).endAngle, 2 * Math.PI),
      ];
      const diff = angles[1] - angles[0];
      if (diff > Math.PI * 2 - 0.1) {
        // If we cover a full circle, we remove a slice to avoid having data point at the same place.
        angles[1] -= diff / axis.data!.length;
      }
      return angles;
    }
    return [
      degreeToRad((axis as RotationConfig).startAngle, 0),
      degreeToRad((axis as RotationConfig).endAngle, 2 * Math.PI),
    ];
  }
  return [0, Math.min(drawingArea.height, drawingArea.width) / 2];
}

const isDateData = (data?: readonly any[]): data is Date[] => data?.[0] instanceof Date;

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

type ComputeCommonParams<T extends ChartSeriesType = ChartSeriesType> = {
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
};

export function computeAxisValue<T extends ChartSeriesType>(
  options: ComputeCommonParams<T> & {
    axis?: AxisConfig<'linear', any, ChartsRadiusAxisProps>[];
    axisDirection: 'radius';
  },
): ComputeResult<ChartsYAxisProps>;
export function computeAxisValue<T extends ChartSeriesType>(
  options: ComputeCommonParams<T> & {
    axis?: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
    axisDirection: 'rotation';
  },
): ComputeResult<ChartsAxisProps>;
export function computeAxisValue<T extends ChartSeriesType>({
  drawingArea,
  formattedSeries,
  axis: allAxis,
  seriesConfig,
  axisDirection,
}: ComputeCommonParams<T> & {
  axis?: AxisConfig<ScaleName, any, ChartsAxisProps>[];
  axisDirection: 'radius' | 'rotation';
}) {
  if (allAxis === undefined) {
    return {
      axis: {},
      axisIds: [],
    };
  }

  const completeAxis: DefaultizedAxisConfig<ChartsAxisProps> = {};
  allAxis.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis as Readonly<AxisConfig<ScaleName, any, Readonly<ChartsAxisProps>>>;
    const range = getRange(drawingArea, axisDirection, axis);

    const [minData, maxData] = getAxisExtremum(
      axis,
      axisDirection,
      seriesConfig as ChartSeriesConfig<PolarChartSeriesType>,
      axisIndex,
      formattedSeries,
    );
    const data = axis.data ?? [];

    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;

      completeAxis[axis.id] = {
        offset: 0,
        categoryGapRatio,
        barGapRatio,
        ...axis,
        data,
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

      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, range);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (isPointScaleConfig(axis)) {
      completeAxis[axis.id] = {
        offset: 0,
        ...axis,
        data,
        scale: scalePoint(axis.data!, range),
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

    const domainLimit = axis.domainLimit ?? 'nice';

    const axisExtremums = [axis.min ?? minData, axis.max ?? maxData];

    if (typeof domainLimit === 'function') {
      const { min, max } = domainLimit(minData, maxData);
      axisExtremums[0] = min;
      axisExtremums[1] = max;
    }

    const rawTickNumber = getTickNumber({ ...axis, range, domain: axisExtremums });
    const tickNumber = rawTickNumber / ((range[1] - range[0]) / 100);

    const scale = getScale(scaleType, axisExtremums, range);
    const finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
    const [minDomain, maxDomain] = finalScale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];

    completeAxis[axis.id] = {
      offset: 0,
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
