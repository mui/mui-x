import * as React from 'react';

import { AxisId } from '../../models/axis';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { CartesianContext } from './CartesianContext';
import { computeValue } from './computeValue';
import { useXExtremumGetter } from '../PluginProvider/useXExtremumGetter';
import { useYExtremumGetter } from '../PluginProvider';
import { CartesianProviderProps } from './Cartesian.types';
import { getAxisExtremum } from './getAxisExtremum';

function CartesianProvider(props: CartesianProviderProps) {
  const { xAxis, yAxis, dataset, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const xExtremumGetters = useXExtremumGetter();
  const yExtremumGetters = useYExtremumGetter();

  const xAxesExtremums: Record<AxisId, [null, null] | [number, number]> = {};
  const yAxesExtremums: Record<AxisId, [null, null] | [number, number]> = {};

  xAxis.forEach((axis, axisIndex) => {
    xAxesExtremums[axis.id] = getAxisExtremum(
      axis,
      xExtremumGetters,
      axisIndex === 0,
      formattedSeries,
    );
  });
  yAxis.forEach((axis, axisIndex) => {
    yAxesExtremums[axis.id] = getAxisExtremum(
      axis,
      yExtremumGetters,
      axisIndex === 0,
      formattedSeries,
    );
  });

  const xValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: xAxis,
        extremumGetters: xExtremumGetters,
        dataset,
        axisDirection: 'x',
      }),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters, dataset],
  );

  const yValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: yAxis,
        extremumGetters: yExtremumGetters,
        dataset,
        axisDirection: 'y',
      }),
    [drawingArea, formattedSeries, yAxis, yExtremumGetters, dataset],
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
