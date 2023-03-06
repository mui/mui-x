import * as React from 'react';
import { getExtremumX, getExtremumY } from '../BarChart/extremums';
import { D3Scale, getScale } from '../hooks/useScale';
import { AxisConfig, Scales } from '../models/axis';
import { DrawingContext } from './DrawingProvider';
import { SeriesContext } from './SeriesContextProvider';

type CartesianContextProviderProps = {
  xAxis: AxisConfig[];
  yAxis: AxisConfig[];
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
  const formattedSeries = React.useContext(SeriesContext);
  const drawingArea = React.useContext(DrawingContext);

  const value = React.useMemo(() => {
    const completedXAxis = {};
    const completedYAxis = {};

    xAxis.forEach((axis) => {
      const [minData, maxData] = getExtremumX({ series: formattedSeries.bar?.series, xAxis: axis });
      const scale = axis.scale ?? ('linea' as Scales);
      completedXAxis[axis.id] = {
        ...axis,
        scale: getScale(scale)
          .domain(scale === 'band' ? axis.data : [axis.min ?? minData, axis.max ?? maxData])
          .range([drawingArea.left, drawingArea.left + drawingArea.width]),
      };
    });

    yAxis.forEach((axis) => {
      const [minData, maxData] = getExtremumY({ series: formattedSeries.bar?.series, yAxis: axis });
      const scale = axis.scale ?? ('linea' as Scales);
      completedYAxis[axis.id] = {
        ...axis,
        scale: getScale(scale)
          .domain(scale === 'band' ? axis.data : [axis.min ?? minData, axis.max ?? maxData])
          .range([drawingArea.top + drawingArea.height, drawingArea.top]),
      };
    });

    return { xAxis: completedXAxis, yAxis: completedYAxis };
  }, [drawingArea, formattedSeries.bar?.series, xAxis, yAxis]);

  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}
