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

export type CartesianContextProviderProps = {
  xAxis?: AxisConfig[];
  yAxis?: AxisConfig[];
  children: React.ReactNode;
};

// TODO: those migt be better placed in a distinc file
const getExtremumX = {
  bar: getBarExtremumX,
  scatter: getScatterExtremumX,
  line: getLineExtremumX,
};
const getExtremumY = {
  bar: getBarExtremumY,
  scatter: getScatterExtremumY,
  line: getLineExtremumY,
};

type DefaultizedAxisConfig = {
  [axisKey: string]: AxisDefaultized;
};

export const CartesianContext = React.createContext<{
  /**
   * Mapping from axis key to scalling function
   */
  xAxis: {
    DEFAULT_X_AXIS_KEY: AxisDefaultized;
  } & DefaultizedAxisConfig;
  yAxis: {
    DEFAULT_X_AXIS_KEY: AxisDefaultized;
  } & DefaultizedAxisConfig;
  // @ts-ignore
}>({ xAxis: {}, yAxis: {} });

export function CartesianContextProvider({
  xAxis,
  yAxis,
  children,
}: CartesianContextProviderProps) {
  const formattedSeries = React.useContext(SeriesContext);
  const drawingArea = React.useContext(DrawingContext);

  const value = React.useMemo(() => {
    const completedXAxis: DefaultizedAxisConfig = {};
    const completedYAxis: DefaultizedAxisConfig = {};

    [
      ...(xAxis ?? []),
      {
        id: DEFAULT_X_AXIS_KEY,
        scaleName: 'linear' as ScaleName,
      },
    ].forEach((axis) => {
      const [minData, maxData] = (
        Object.keys(getExtremumX) as Array<keyof typeof getExtremumX>
      ).reduce(
        ([currentMinData, currentMaxData]: [number | null, number | null], chartType) => {
          if (formattedSeries[chartType]?.series === undefined) {
            return [currentMinData, currentMaxData];
          }
          const [minChartTypeData, maxChartTypeData] = getExtremumX[chartType]({
            // @ts-ignore TODO: find a way to let TS understand types are coherend because they come from the same key
            series: formattedSeries[chartType]?.series ?? {},
            xAxis: axis,
          });
          if (currentMinData === null || currentMaxData === null) {
            return [minChartTypeData, maxChartTypeData];
          }
          if (minChartTypeData === null || maxChartTypeData === null) {
            return [currentMinData, currentMaxData];
          }
          return [
            Math.min(minChartTypeData, currentMinData),
            Math.max(maxChartTypeData, currentMaxData),
          ];
        },
        [null, null],
      );

      const scaleName = axis.scaleName ?? ('linear' as ScaleName);
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

    [
      ...(yAxis ?? []),
      {
        id: DEFAULT_Y_AXIS_KEY,
        scaleName: 'linear' as ScaleName,
      },
    ].forEach((axis) => {
      const [minData, maxData] = (
        Object.keys(getExtremumX) as Array<keyof typeof getExtremumX>
      ).reduce(
        ([currentMinData, currentMaxData]: [number | null, number | null], chartType) => {
          if (formattedSeries[chartType]?.series === undefined) {
            return [currentMinData, currentMaxData];
          }

          const [minChartTypeData, maxChartTypeData] = getExtremumY[chartType]({
            // @ts-ignore
            series: formattedSeries[chartType]?.series,
            yAxis: axis,
          });
          if (currentMinData === null || currentMaxData === null) {
            return [minChartTypeData, maxChartTypeData];
          }
          if (minChartTypeData === null || maxChartTypeData === null) {
            return [currentMinData, currentMaxData];
          }
          return [
            Math.min(minChartTypeData, currentMinData),
            Math.max(maxChartTypeData, currentMaxData),
          ];
        },
        [null, null],
      );

      const scaleName = axis.scaleName ?? ('linear' as ScaleName);
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

    return { xAxis: completedXAxis, yAxis: completedYAxis };
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
