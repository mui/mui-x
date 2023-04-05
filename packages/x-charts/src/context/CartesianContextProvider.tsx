import * as React from 'react';
import {
  getExtremumX as getBarExtremumX,
  getExtremumY as getBarExtremumY,
} from '../BarChart/extremums';
import {
  getExtremumX as getScatterExtremumX,
  getExtremumY as getScatterExtremumY,
} from '../ScatterChart/extremums';
import {
  getExtremumX as getLineExtremumX,
  getExtremumY as getLineExtremumY,
} from '../LineChart/extremums';
import { getScale } from '../hooks/useScale';
import { AxisConfig, AxisDefaultized, ScaleName } from '../models/axis';
import { DrawingContext } from './DrawingProvider';
import { SeriesContext } from './SeriesContextProvider';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import {
  ChartSeries,
  ChartSeriesType,
  ExtremumGetter,
  ExtremumGetterResult,
} from '../models/seriesType/config';

export type CartesianContextProviderProps = {
  xAxis?: AxisConfig[];
  yAxis?: AxisConfig[];
  children: React.ReactNode;
};

// TODO: those might be better placed in a distinct file
const xExtremumGetters: { [T in ChartSeriesType]: ExtremumGetter<T> } = {
  bar: getBarExtremumX,
  scatter: getScatterExtremumX,
  line: getLineExtremumX,
};

const yExtremumGetters: { [T in ChartSeriesType]: ExtremumGetter<T> } = {
  bar: getBarExtremumY,
  scatter: getScatterExtremumY,
  line: getLineExtremumY,
};

type DefaultizedAxisConfig = {
  [axisKey: string]: AxisDefaultized;
};

export const CartesianContext = React.createContext<{
  /**
   * Mapping from axis key to scaling function
   */
  xAxis: {
    DEFAULT_X_AXIS_KEY: AxisDefaultized;
  } & DefaultizedAxisConfig;
  yAxis: {
    DEFAULT_X_AXIS_KEY: AxisDefaultized;
  } & DefaultizedAxisConfig;
  xAxisIds: string[];
  yAxisIds: string[];
  // @ts-ignore
}>({ xAxis: {}, yAxis: {}, xAxisIds: [], yAxisIds: [] });

export function CartesianContextProvider({
  xAxis,
  yAxis,
  children,
}: CartesianContextProviderProps) {
  const formattedSeries = React.useContext(SeriesContext);
  const drawingArea = React.useContext(DrawingContext);

  const value = React.useMemo(() => {
    const axisExtremumCallback = <T extends keyof typeof xExtremumGetters>(
      acc: ExtremumGetterResult,
      chartType: T,
      axis: AxisConfig,
      getters: { [T2 in ChartSeriesType]: ExtremumGetter<T2> },
    ): ExtremumGetterResult => {
      const getter = getters[chartType];
      const series = (formattedSeries[chartType]?.series as { [id: string]: ChartSeries<T> }) ?? {};

      const [minChartTypeData, maxChartTypeData] = getter({
        series,
        axis,
      });

      const [minData, maxData] = acc;

      if (minData === null || maxData === null) {
        return [minChartTypeData!, maxChartTypeData!];
      }

      if (minChartTypeData === null || maxChartTypeData === null) {
        return [minData, maxData];
      }

      return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
    };

    const getAxisExtremum = (
      axis: AxisConfig,
      getters: { [T in ChartSeriesType]: ExtremumGetter<T> },
    ) => {
      const charTypes = Object.keys(getters) as ChartSeriesType[];

      return charTypes.reduce(
        (acc, charType) => axisExtremumCallback(acc, charType, axis, getters),
        [null, null] as ExtremumGetterResult,
      );
    };

    const allXAxis: AxisConfig[] = [
      ...(xAxis ?? []),
      { id: DEFAULT_X_AXIS_KEY, scaleName: 'linear' },
    ];

    const completedXAxis: DefaultizedAxisConfig = {};
    allXAxis.forEach((axis) => {
      const [minData, maxData] = getAxisExtremum(axis, xExtremumGetters);

      const scaleName = axis.scaleName ?? 'linear';
      completedXAxis[axis.id] = {
        ...axis,
        scaleName,
        scale: getScale(scaleName)
          // @ts-ignore
          .domain(scaleName === 'band' ? axis.data : [axis.min ?? minData, axis.max ?? maxData])
          // @ts-ignore
          .range([drawingArea.left, drawingArea.left + drawingArea.width]),
      };
    });

    const allYAxis: AxisConfig[] = [
      ...(yAxis ?? []),
      { id: DEFAULT_Y_AXIS_KEY, scaleName: 'linear' },
    ];

    const completedYAxis: DefaultizedAxisConfig = {};
    allYAxis.forEach((axis) => {
      const [minData, maxData] = getAxisExtremum(axis, yExtremumGetters);

      const scaleName: ScaleName = axis.scaleName ?? 'linear';
      completedYAxis[axis.id] = {
        ...axis,
        scaleName,
        scale: getScale(scaleName)
          // @ts-ignore
          .domain(scaleName === 'band' ? axis.data : [axis.min ?? minData, axis.max ?? maxData])
          // @ts-ignore
          .range([drawingArea.top + drawingArea.height, drawingArea.top]),
      };
    });

    return {
      xAxis: completedXAxis,
      yAxis: completedYAxis,
      xAxisIds: [...(xAxis ?? []), { id: DEFAULT_X_AXIS_KEY }]?.map(({ id }) => id),
      yAxisIds: [...(yAxis ?? []), { id: DEFAULT_Y_AXIS_KEY }]?.map(({ id }) => id),
    };
  }, [
    drawingArea.height,
    drawingArea.left,
    drawingArea.top,
    drawingArea.width,
    formattedSeries,
    xAxis,
    yAxis,
  ]);

  // @ts-ignore
  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}
