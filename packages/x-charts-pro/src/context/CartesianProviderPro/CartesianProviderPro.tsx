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
  const { zoomRange } = useZoom();

  const xAxis = React.useMemo(() => normalizeAxis(inXAxis, dataset, 'x'), [inXAxis, dataset]);

  const yAxis = React.useMemo(() => normalizeAxis(inYAxis, dataset, 'y'), [inYAxis, dataset]);

  const xValues = React.useMemo(
    () => computeValue(drawingArea, formattedSeries, xAxis, xExtremumGetters, 'x', zoomRange),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters, zoomRange],
  );

  const yValues = React.useMemo(
    () => computeValue(drawingArea, formattedSeries, yAxis, yExtremumGetters, 'y'),
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

export { CartesianContextProviderPro };
