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
import { createAxisFilterMapper } from './createAxisFilterMapper';

const { computeValue } = cartesianProviderUtils;

export interface CartesianProviderProProps extends CartesianProviderProps {}

function CartesianProviderPro(props: CartesianProviderProProps) {
  const { xAxis, yAxis, dataset, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const { zoomData, options } = useZoom();
  const xExtremumGetters = useXExtremumGetter();
  const yExtremumGetters = useYExtremumGetter();

  const zoomFilter = React.useMemo(() => {
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

    const xFilters = xAxis.map(xMapper).filter((f) => f !== null);

    const yFilters = yAxis.map(yMapper).filter((f) => f !== null);

    if (xFilters.length === 0 && yFilters.length === 0) {
      return undefined;
    }

    // Filters are applied on the reverse axis, so the naming below is correct.
    return {
      xFilters: (index: number) => yFilters.every((f) => f(index)),
      yFilters: (index: number) => xFilters.every((f) => f(index)),
    };
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
        zoomFilter: zoomFilter?.xFilters,
      }),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters, dataset, zoomData, options, zoomFilter],
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
        zoomFilter: zoomFilter?.yFilters,
      }),
    [drawingArea, formattedSeries, yAxis, yExtremumGetters, dataset, zoomData, options, zoomFilter],
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
