import * as React from 'react';
import { D3Scale, getScale } from '../hooks/useScale';
import { AxisConfig } from '../models/axis';
import { DrawingContext } from './DrawingProvider';

type CartesianContextProviderProps = {
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  children: React.ReactNode;
};

interface CompoutedAxisConfig extends Omit<AxisConfig, 'scale'> {
  scale: D3Scale;
}

export const CartesianContext = React.createContext<{
  /**
   * Mapping from axis key to scalling function
   */
  xAxis: {
    [axisKey: string]: CompoutedAxisConfig;
  };
  yAxis: {
    [axisKey: string]: CompoutedAxisConfig;
  };
}>({ xAxis: {}, yAxis: {} });

export function CartesianContextProvider({
  xAxis,
  yAxis,
  children,
}: CartesianContextProviderProps) {
  // const formattedSeries = React.useContext(SeriesContext);
  const drawingArea = React.useContext(DrawingContext);

  // TODO remove and compute from series
  const xScale = 'band';
  const yScale = 'linear';

  const value = React.useMemo(() => {
    const completedXAxis = {};
    const completedYAxis = {};

    xAxis.forEach((axis) => {
      completedXAxis[axis.id] = {
        ...axis,
        scale: getScale(xScale)
          .domain(xScale === 'band' ? axis.data : [-5, 20])
          .range([drawingArea.left, drawingArea.left + drawingArea.width]),
      };
    });

    yAxis.forEach((axis) => {
      completedYAxis[axis.id] = {
        ...axis,
        scale: getScale(yScale)
          .domain(yScale === 'band' ? yAxis.data : [-5, 20])
          .range([drawingArea.top + drawingArea.height, drawingArea.top]),
      };
    });

    return { xAxis: completedXAxis, yAxis: completedYAxis };
  }, [drawingArea, xAxis, yAxis]);

  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}
