import * as React from 'react';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '../../models/axis';
import { DatasetType } from '../../models/seriesType/config';
import { MakeOptional } from '../../models/helpers';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { CartesianContext } from './CartesianContext';
import { normalizeAxis } from './normalizeAxis';
import { computeValue } from './computeValue';
import { ExtremumGettersConfig } from '../../models';

export type CartesianContextProviderProps = {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[];
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
  const {
    xAxis: inXAxis,
    yAxis: inYAxis,
    dataset,
    xExtremumGetters,
    yExtremumGetters,
    children,
  } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();

  const xAxis = React.useMemo(() => normalizeAxis(inXAxis, dataset, 'x'), [inXAxis, dataset]);

  const yAxis = React.useMemo(() => normalizeAxis(inYAxis, dataset, 'y'), [inYAxis, dataset]);

  const value = React.useMemo(
    () =>
      computeValue(drawingArea, formattedSeries, xAxis, yAxis, xExtremumGetters, yExtremumGetters),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters, yAxis, yExtremumGetters],
  );

  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}

export { CartesianContextProvider };
