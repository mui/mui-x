import * as React from 'react';
import {
  useDrawingArea,
  useSeries,
  CartesianContext,
  CartesianProviderProps,
  cartesianProviderUtils,
  useXExtremumGetter,
  useYExtremumGetter,
  getAxisExtremum,
} from '@mui/x-charts/internals';
import { useZoom } from '../ZoomProvider/useZoom';

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
    const xFilters = xAxis
      .map((axis, axisIndex) => {
        if (typeof axis.zoom !== 'object' || axis.zoom.filterMode !== 'discard') {
          return null;
        }

        const zoom = zoomData?.find(({ axisId }) => axisId === axis.id);
        if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
          // No zoom, or zoom with all data visible
          return null;
        }

        let min: number;
        let max: number;

        if (axis.scaleType === 'point' || axis.scaleType === 'band') {
          min = 0;
          max = (axis.data?.length ?? 0) - 1;
        } else {
          [min, max] = getAxisExtremum(axis, xExtremumGetters, axisIndex === 0, formattedSeries);
        }

        const minVal = min + (zoom.start * (max - min)) / 100;
        const maxVal = min + (zoom.end * (max - min)) / 100;

        return (dataIndex: number) => {
          const val = axis.data?.[dataIndex];
          if (val == null) {
            // If the value does not exist because of missing data point, or out of range index, we just ignore.
            return true;
          }

          if (axis.scaleType === 'point' || axis.scaleType === 'band') {
            return dataIndex >= minVal && dataIndex <= maxVal;
          }

          return val >= minVal && val <= maxVal;
        };
      })
      .filter((f) => f !== null);

    const yFilters = yAxis
      .map((axis, axisIndex) => {
        if (typeof axis.zoom !== 'object' || axis.zoom.filterMode !== 'discard') {
          return null;
        }

        const zoom = zoomData?.find(({ axisId }) => axisId === axis.id);
        if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
          // No zoom, or zoom with all data visible
          return null;
        }

        let min: number;
        let max: number;

        if (axis.scaleType === 'point' || axis.scaleType === 'band') {
          min = 0;
          max = (axis.data?.length ?? 0) - 1;
        } else {
          [min, max] = getAxisExtremum(axis, yExtremumGetters, axisIndex === 0, formattedSeries);
        }

        const minVal = min + (zoom.start * (max - min)) / 100;
        const maxVal = min + (zoom.end * (max - min)) / 100;
        return (dataIndex: number) => {
          const val = axis.data?.[dataIndex];
          if (val == null) {
            // If the value does not exist because of missing data point, or out of range index, we just ignore.
            return true;
          }

          if (axis.scaleType === 'point' || axis.scaleType === 'band') {
            return dataIndex >= minVal && dataIndex <= maxVal;
          }

          // Will not work if zooming along y-axis on a line chart because the y-axis has no `data`.
          return val >= minVal && val <= maxVal;
        };
      })
      .filter((f) => f !== null);

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
