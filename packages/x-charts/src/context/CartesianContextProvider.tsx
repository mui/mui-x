import * as React from 'react';
import { scaleBand } from 'd3-scale';
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
import { MakeOptional } from '../models/helpers';
import { getTicksNumber } from '../hooks/useTicks';

export type CartesianContextProviderProps = {
  xAxis?: MakeOptional<AxisConfig, 'id'>[];
  yAxis?: MakeOptional<AxisConfig, 'id'>[];
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
      isDefaultAxis: boolean,
    ): ExtremumGetterResult => {
      const getter = getters[chartType];
      const series = (formattedSeries[chartType]?.series as { [id: string]: ChartSeries<T> }) ?? {};

      const [minChartTypeData, maxChartTypeData] = getter({
        series,
        axis,
        isDefaultAxis,
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
      isDefaultAxis: boolean,
    ) => {
      const charTypes = Object.keys(getters) as ChartSeriesType[];

      return charTypes.reduce(
        (acc, charType) => axisExtremumCallback(acc, charType, axis, getters, isDefaultAxis),
        [null, null] as ExtremumGetterResult,
      );
    };

    const allXAxis: AxisConfig[] = [
      ...(xAxis?.map((axis, index) => ({ id: `deaultized-x-axis-${index}`, ...axis })) ?? []),
      // Allows to specify an axis with id=DEFAULT_X_AXIS_KEY
      ...(xAxis === undefined || xAxis.findIndex(({ id }) => id === DEFAULT_X_AXIS_KEY) === -1
        ? [{ id: DEFAULT_X_AXIS_KEY, scaleType: 'linear' } as AxisConfig]
        : []),
    ];

    const completedXAxis: DefaultizedAxisConfig = {};
    allXAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, xExtremumGetters, isDefaultAxis);

      const scaleType = axis.scaleType ?? 'linear';
      const range = [drawingArea.left, drawingArea.left + drawingArea.width];

      if (scaleType === 'band') {
        completedXAxis[axis.id] = {
          ...axis,
          scaleType,
          scale: scaleBand(axis.data!, range),
          ticksNumber: axis.data!.length,
        };
        return;
      }
      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const ticksNumber = getTicksNumber({ ...axis, range });

      const niceScale = getScale(scaleType, extremums, range).nice(ticksNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];

      completedXAxis[axis.id] = {
        ...axis,
        scaleType,
        scale: niceScale.domain(domain),
        ticksNumber,
      } as AxisDefaultized<typeof scaleType>;
    });

    const allYAxis: AxisConfig[] = [
      ...(yAxis?.map((axis, index) => ({ id: `deaultized-y-axis-${index}`, ...axis })) ?? []),
      ...(yAxis === undefined || yAxis.findIndex(({ id }) => id === DEFAULT_Y_AXIS_KEY) === -1
        ? [{ id: DEFAULT_Y_AXIS_KEY, scaleType: 'linear' } as AxisConfig]
        : []),
    ];

    const completedYAxis: DefaultizedAxisConfig = {};
    allYAxis.forEach((axis, axisIndex) => {
      const isDefaultAxis = axisIndex === 0;
      const [minData, maxData] = getAxisExtremum(axis, yExtremumGetters, isDefaultAxis);
      const range = [drawingArea.top + drawingArea.height, drawingArea.top];

      const scaleType: ScaleName = axis.scaleType ?? 'linear';
      if (scaleType === 'band') {
        completedYAxis[axis.id] = {
          ...axis,
          scaleType,
          scale: scaleBand(axis.data!, range),
          ticksNumber: axis.data!.length,
        };
        return;
      }
      const extremums = [axis.min ?? minData, axis.max ?? maxData];
      const ticksNumber = getTicksNumber({ ...axis, range });

      const niceScale = getScale(scaleType, extremums, range).nice(ticksNumber);
      const niceDomain = niceScale.domain();
      const domain = [axis.min ?? niceDomain[0], axis.max ?? niceDomain[1]];

      completedYAxis[axis.id] = {
        ...axis,
        scaleType,
        scale: niceScale.domain(domain),
        ticksNumber,
      } as AxisDefaultized<typeof scaleType>;
    });

    return {
      xAxis: completedXAxis,
      yAxis: completedYAxis,
      xAxisIds: allXAxis.map(({ id }) => id),
      yAxisIds: allYAxis.map(({ id }) => id),
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
