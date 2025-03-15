'use client';
import { useSeries } from '../hooks/useSeries';
import { useColorProcessor } from '../internals/plugins/corePlugins/useChartSeries/useColorProcessor';
import { SeriesId } from '../models/seriesType/common';
import {
  CartesianChartSeriesType,
  ChartsSeriesConfig,
  PolarChartSeriesType,
} from '../models/seriesType/config';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { getLabel } from '../internals/getLabel';
import { isCartesianSeriesType } from '../internals/isCartesian';
import { utcFormatter } from './utils';
import {
  useRadiusAxes,
  useRadiusAxis,
  useRotationAxes,
  useRotationAxis,
  useXAxes,
  useXAxis,
  useYAxes,
  useYAxis,
} from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import {
  selectorChartsInteractionXAxis,
  selectorChartsInteractionYAxis,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import { ChartsLabelMarkProps } from '../ChartsLabel';
import { isPolarSeriesType } from '../internals/isPolar';
import { AxisDefaultized, PolarAxisDefaultized } from '../models/axis';

export interface UseAxisTooltipReturnValue<
  SeriesT extends CartesianChartSeriesType | PolarChartSeriesType =
    | CartesianChartSeriesType
    | PolarChartSeriesType,
  AxisValueT extends string | number | Date = string | number | Date,
> {
  axisDirection: SeriesT extends CartesianChartSeriesType ? 'x' | 'y' : 'rotation' | 'radius';
  mainAxis: SeriesT extends CartesianChartSeriesType ? AxisDefaultized : PolarAxisDefaultized;
  dataIndex: number;
  seriesItems: SeriesItem<SeriesT>[];
  axisValue: AxisValueT;
  axisFormattedValue: string;
}

interface SeriesItem<T extends CartesianChartSeriesType | PolarChartSeriesType> {
  seriesId: SeriesId;
  color: string;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string;
  formattedLabel: string | null;
  markType: ChartsLabelMarkProps['type'];
}

export function useAxisTooltip(): UseAxisTooltipReturnValue | null {
  const defaultXAxis = useXAxis();
  const defaultYAxis = useYAxis();
  const defaultRotationAxis = useRotationAxis();
  const defaultRadiusAxis = useRadiusAxis();

  const isPolarChart = defaultRotationAxis !== undefined || defaultRadiusAxis !== undefined;
  const xAxisHasData = defaultXAxis?.data !== undefined && defaultXAxis?.data.length !== 0;
  const rotationAxisHasData =
    defaultRotationAxis?.data !== undefined && defaultRotationAxis?.data.length !== 0;

  // eslint-disable-next-line no-nested-ternary
  const axisDirection = isPolarChart
    ? rotationAxisHasData
      ? 'rotation'
      : 'radius'
    : xAxisHasData
      ? 'x'
      : 'y';

  // eslint-disable-next-line no-nested-ternary
  const mainAxis = isPolarChart
    ? rotationAxisHasData
      ? defaultRotationAxis
      : defaultRadiusAxis
    : xAxisHasData
      ? defaultXAxis
      : defaultYAxis;

  const store = useStore();

  const axisData = useSelector(
    store,
    (isPolarChart ? rotationAxisHasData : xAxisHasData)
      ? selectorChartsInteractionXAxis
      : selectorChartsInteractionYAxis,
  );

  const series = useSeries();

  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();

  const { rotationAxis } = useRotationAxes();
  const { radiusAxis } = useRadiusAxes();

  const colorProcessors = useColorProcessor();

  if (axisData === null) {
    return null;
  }

  const { index: dataIndex, value: axisValue } = axisData;
  const USED_AXIS_ID = mainAxis.id;

  const relevantSeries = Object.keys(series)
    .filter((s) => isCartesianSeriesType(s) || isPolarSeriesType(s))
    .flatMap(
      <SeriesT extends CartesianChartSeriesType | PolarChartSeriesType>(seriesType: SeriesT) => {
        const seriesOfType = series[seriesType];
        if (!seriesOfType) {
          return [];
        }
        return seriesOfType.seriesOrder.map((seriesId) => {
          const seriesToAdd = seriesOfType.series[seriesId]!;

          const providedXAxisId: string | undefined = (seriesToAdd as any).xAxisId;
          const providedYAxisId: string | undefined = (seriesToAdd as any).yAxisId;
          const providedRotationAxisId: string | undefined = (seriesToAdd as any).rotationAxisId;
          const providedRadiusAxisId: string | undefined = (seriesToAdd as any).radiusAxisId;

          let axisKey: string | undefined;
          switch (axisDirection) {
            case 'x':
              axisKey = providedXAxisId;
              break;
            case 'y':
              axisKey = providedYAxisId;
              break;
            case 'rotation':
              axisKey = providedRotationAxisId;
              break;
            case 'radius':
              axisKey = providedRadiusAxisId;
              break;
            default:
              break;
          }

          // Test if the series uses the default axis
          if (axisKey === undefined || axisKey === USED_AXIS_ID) {
            const xAxisId = providedXAxisId ?? defaultXAxis?.id;
            const yAxisId = providedYAxisId ?? defaultYAxis?.id;
            const zAxisId = 'zAxisId' in seriesToAdd ? seriesToAdd.zAxisId : zAxisIds[0];
            const rotationAxisId = providedRotationAxisId ?? defaultRotationAxis?.id;
            const radiusAxisId = providedRadiusAxisId ?? defaultRadiusAxis?.id;

            const color =
              colorProcessors[seriesType]?.(
                seriesToAdd,
                xAxis[xAxisId] ?? rotationAxis[rotationAxisId],
                yAxis[yAxisId] ?? radiusAxis[radiusAxisId],
                zAxisId ? zAxis[zAxisId] : undefined,
              )(dataIndex) ?? '';

            const value = seriesToAdd.data[dataIndex] ?? null;
            const formattedValue = (seriesToAdd.valueFormatter as any)(value, {
              dataIndex,
            });
            const formattedLabel = getLabel(seriesToAdd.label, 'tooltip') ?? null;

            return {
              seriesId,
              color,
              value,
              formattedValue,
              formattedLabel,
              markType: seriesToAdd.labelMarkType,
            };
          }
          return undefined;
        });
      },
    )
    .filter(function truthy<T>(
      item: T,
    ): item is T extends false | '' | 0 | null | undefined ? never : T {
      return Boolean(item);
    });

  const axisFormatter =
    mainAxis.valueFormatter ??
    ((v: string | number | Date) =>
      mainAxis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());

  const axisFormattedValue = axisFormatter(axisValue, {
    location: 'tooltip',
    scale: mainAxis.scale,
  });

  return {
    axisDirection,
    mainAxis,
    dataIndex,
    seriesItems: relevantSeries,
    axisValue,
    axisFormattedValue,
  };
}
