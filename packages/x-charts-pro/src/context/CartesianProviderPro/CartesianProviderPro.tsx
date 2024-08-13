import * as React from 'react';
import {
  useDrawingArea,
  useSeries,
  CartesianContext,
  CartesianProviderProps,
  cartesianProviderUtils,
  useXExtremumGetter,
  useYExtremumGetter,
  ZoomAxisFilters,
} from '@mui/x-charts/internals';
import { useZoom } from '../ZoomProvider/useZoom';
import { createAxisFilterMapper, createGetAxisFilters } from './createAxisFilterMapper';

const { computeValue } = cartesianProviderUtils;

export interface CartesianProviderProProps extends CartesianProviderProps {}

function CartesianProviderPro(props: CartesianProviderProProps) {
  const { xAxis, yAxis, dataset, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const { zoomData, options } = useZoom();
  const xExtremumGetters = useXExtremumGetter();
  const yExtremumGetters = useYExtremumGetter();

  const getZoomFilters = React.useMemo(() => {
    const xMapper = createAxisFilterMapper({
      zoomData,
      extremumGetter: xExtremumGetters,
      formattedSeries,
    });

    const yMapper = createAxisFilterMapper({
      zoomData,
      extremumGetter: yExtremumGetters,
      formattedSeries,
    });

    const xFilters = xAxis.reduce((acc, axis, index) => {
      const filter = xMapper(axis, index);
      if (filter !== null) {
        acc[axis.id] = filter;
      }
      return acc;
    }, {} as ZoomAxisFilters);

    const yFilters = yAxis.reduce((acc, axis, index) => {
      const filter = yMapper(axis, index);
      if (filter !== null) {
        acc[axis.id] = filter;
      }
      return acc;
    }, {} as ZoomAxisFilters);

    if (Object.keys(xFilters).length === 0 && Object.keys(yFilters).length === 0) {
      return undefined;
    }

    return createGetAxisFilters({ ...xFilters, ...yFilters });
  }, [formattedSeries, xAxis, xExtremumGetters, yAxis, yExtremumGetters, zoomData]);

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
        zoomOptions: options,
        getZoomFilters,
      }),
    [
      drawingArea,
      formattedSeries,
      xAxis,
      xExtremumGetters,
      dataset,
      zoomData,
      options,
      getZoomFilters,
    ],
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
        zoomOptions: options,
        getZoomFilters,
      }),
    [
      drawingArea,
      formattedSeries,
      yAxis,
      yExtremumGetters,
      dataset,
      zoomData,
      options,
      getZoomFilters,
    ],
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
