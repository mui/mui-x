import * as React from 'react';
import {
  useDrawingArea,
  useSeries,
  CartesianContext,
  CartesianProviderProps,
  cartesianProviderUtils,
  useXExtremumGetter,
  useYExtremumGetter,
} from '@mui/x-charts/internals';
import { useZoom } from '../ZoomProvider/useZoom';

const { computeValue } = cartesianProviderUtils;

export interface CartesianProviderProProps extends CartesianProviderProps {}

function CartesianProviderPro(props: CartesianProviderProProps) {
  const { xAxis, yAxis, dataset, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const { zoomData } = useZoom();
  const xExtremumGetters = useXExtremumGetter();
  const yExtremumGetters = useYExtremumGetter();

  const xValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: xAxis,
        extremumGetters: xExtremumGetters,
        dataset,
        axisDirection: 'x',
        zoomData,
      }),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters, dataset, zoomData],
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
        zoomData,
      }),
    [drawingArea, formattedSeries, yAxis, yExtremumGetters, dataset, zoomData],
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

export { CartesianProviderPro };
