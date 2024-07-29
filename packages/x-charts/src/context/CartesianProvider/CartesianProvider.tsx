import * as React from 'react';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '../../models/axis';
import { DatasetType } from '../../models/seriesType/config';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { CartesianContext } from './CartesianContext';
import { computeValue } from './computeValue';
import { ExtremumGettersConfig } from '../../models';

export type CartesianContextProviderProps = {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: AxisConfig<ScaleName, any, ChartsXAxisProps>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: AxisConfig<ScaleName, any, ChartsYAxisProps>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: DatasetType;
  /**
   * An object with x-axis extremum getters per series type.
   */
  xExtremumGetters: ExtremumGettersConfig;
  /**
   * An object with y-axis extremum getters per series type.
   */
  yExtremumGetters: ExtremumGettersConfig;
  children: React.ReactNode;
};

function CartesianContextProvider(props: CartesianContextProviderProps) {
  const { xAxis, yAxis, dataset, xExtremumGetters, yExtremumGetters, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();

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

export { CartesianContextProvider };
