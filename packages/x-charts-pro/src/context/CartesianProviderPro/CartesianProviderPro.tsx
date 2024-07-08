import * as React from 'react';
import {
  useDrawingArea,
  useSeries,
  CartesianContext,
  CartesianContextProviderProps,
  cartesianProviderUtils,
} from '@mui/x-charts/internals';
import { useZoom } from '../ZoomProvider/useZoom';

const { normalizeAxis, computeValue } = cartesianProviderUtils;

export interface CartesianContextProviderProProps extends CartesianContextProviderProps {}

function CartesianContextProviderPro(props: CartesianContextProviderProProps) {
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
  const { zoomData } = useZoom();

  const xAxis = React.useMemo(() => normalizeAxis(inXAxis, dataset, 'x'), [inXAxis, dataset]);

  const yAxis = React.useMemo(() => normalizeAxis(inYAxis, dataset, 'y'), [inYAxis, dataset]);

  const xValues = React.useMemo(
    () => computeValue(drawingArea, formattedSeries, xAxis, xExtremumGetters, 'x', zoomData),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters, zoomData],
  );

  const yValues = React.useMemo(
    () => computeValue(drawingArea, formattedSeries, yAxis, yExtremumGetters, 'y', zoomData),
    [drawingArea, formattedSeries, yAxis, yExtremumGetters, zoomData],
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

export { CartesianContextProviderPro };
