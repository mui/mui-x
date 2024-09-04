import * as React from 'react';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { CartesianContext } from './CartesianContext';
import { computeValue } from './computeValue';
import { useXExtremumGetter } from '../PluginProvider/useXExtremumGetter';
import { useYExtremumGetter } from '../PluginProvider';
import { CartesianProviderProps } from './Cartesian.types';

function CartesianProvider(props: CartesianProviderProps) {
  const { xAxis, yAxis, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const xExtremumGetters = useXExtremumGetter();
  const yExtremumGetters = useYExtremumGetter();

  const xValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: xAxis,
        extremumGetters: xExtremumGetters,
        axisDirection: 'x',
      }),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters],
  );

  const yValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: yAxis,
        extremumGetters: yExtremumGetters,
        axisDirection: 'y',
      }),
    [drawingArea, formattedSeries, yAxis, yExtremumGetters],
  );

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        xAxis: xValues.axis,
        yAxis: yValues.axis,
        xAxisIds: xValues.axisIds,
        yAxisIds: yValues.axisIds,
      },
    }),
    [xValues, yValues],
  );

  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}

export { CartesianProvider };
