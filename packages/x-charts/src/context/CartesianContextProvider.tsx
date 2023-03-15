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
import { D3Scale, getScale } from '../hooks/useScale';
import { AxisConfig, Scales } from '../models/axis';
import { DrawingContext } from './DrawingProvider';
import { SeriesContext } from './SeriesContextProvider';

type CartesianContextProviderProps = {
  xAxis?: AxisConfig[];
  yAxis?: AxisConfig[];
  children: React.ReactNode;
};

interface CompoutedAxisConfig extends Omit<AxisConfig, 'scale'> {
  scale: D3Scale;
}

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

export const CartesianContext = React.createContext<{
  /**
   * Mapping from axis key to scalling function
   */
  xAxis: {
    DEFAULT_X_AXIS_KEY: CompoutedAxisConfig;
    [axisKey: string]: CompoutedAxisConfig;
  };
  yAxis: {
    DEFAULT_X_AXIS_KEY: CompoutedAxisConfig;
    [axisKey: string]: CompoutedAxisConfig;
  };
}>({ xAxis: {}, yAxis: {} });

export function CartesianContextProvider({
  xAxis,
  yAxis,
  children,
}: CartesianContextProviderProps) {
  const formattedSeries = React.useContext(SeriesContext);
  const drawingArea = React.useContext(DrawingContext);

  const value = React.useMemo(() => {
    const completedXAxis = {};
    const completedYAxis = {};

    [
      ...(xAxis ?? []),
      {
        id: 'DEFAULT_X_AXIS_KEY',
        scale: 'linear',
      },
    ].forEach((axis) => {
      const [minData, maxData] = Object.keys(getExtremumX).reduce(
        ([currentMinData, currentMaxData], chartType) => {
          if (formattedSeries[chartType]?.series === undefined) {
            return [currentMinData, currentMaxData];
          }
          const [minChartTypeData, maxChartTypeData] = getExtremumX[chartType]({
            series: formattedSeries[chartType]?.series,
            xAxis: axis,
          });
          return [
            currentMinData === null ? minChartTypeData : Math.min(minChartTypeData, currentMinData),
            currentMaxData === null ? maxChartTypeData : Math.max(maxChartTypeData, currentMaxData),
          ];
        },
        [null, null],
      );

      const scale = axis.scale ?? ('linea' as Scales);
      completedXAxis[axis.id] = {
        ...axis,
        scale: getScale(scale)
          .domain(scale === 'band' ? axis.data : [axis.min ?? minData, axis.max ?? maxData])
          .range([drawingArea.left, drawingArea.left + drawingArea.width]),
      };
    });

    [
      ...(yAxis ?? []),
      {
        id: 'DEFAULT_Y_AXIS_KEY',
        scale: 'linear',
      },
    ].forEach((axis) => {
      const [minData, maxData] = Object.keys(getExtremumY).reduce(
        ([currentMinData, currentMaxData], chartType) => {
          if (formattedSeries[chartType]?.series === undefined) {
            return [currentMinData, currentMaxData];
          }

          const [minChartTypeData, maxChartTypeData] = getExtremumY[chartType]({
            series: formattedSeries[chartType]?.series,
            yAxis: axis,
          });
          return [
            currentMinData === null ? minChartTypeData : Math.min(minChartTypeData, currentMinData),
            currentMaxData === null ? maxChartTypeData : Math.max(maxChartTypeData, currentMaxData),
          ];
        },
        [null, null],
      );

      const scale = axis.scale ?? ('linea' as Scales);
      completedYAxis[axis.id] = {
        ...axis,
        scale: getScale(scale)
          .domain(scale === 'band' ? axis.data : [axis.min ?? minData, axis.max ?? maxData])
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

  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}
