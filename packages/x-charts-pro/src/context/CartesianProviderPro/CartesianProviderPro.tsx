import * as React from 'react';
import {
  useDrawingArea,
  useSeries,
  CartesianContext,
  CartesianContextProviderProps,
  cartesianProviderUtils,
} from '@mui/x-charts/internals';
import { ExtremumGettersConfig } from '@mui/x-charts/models';
import { useZoom } from '../ZoomProvider/useZoom';

const { normalizeAxis, computeValue } = cartesianProviderUtils;

const calculateZoom = (
  data: [number | null, number | null],
  zoom: [number, number],
): [number | null, number | null] => {
  const [min, max] = data;
  const [minZoom, maxZoom] = zoom;

  if (min === null || max === null || !Number.isFinite(min) || !Number.isFinite(max)) {
    return [null, null];
  }
  const diff = max - min;
  const newMin = min + (diff * minZoom) / 100;
  const newMax = min + (diff * maxZoom) / 100;

  return [newMin, newMax];
};

const zoomExtremumGetter = (getters: ExtremumGettersConfig, zoom: [number, number]) => {
  return Object.fromEntries(
    Object.entries(getters).map(([key, value]) => [
      key,
      (...getterProp: any[]) => {
        // @ts-expect-error, params are correct.
        const data = value(...getterProp);
        const result = calculateZoom(data, zoom);
        return result;
      },
    ]),
  );
};

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
    () =>
      computeValue(
        drawingArea,
        formattedSeries,
        xAxis,
        zoomExtremumGetter(xExtremumGetters, zoomRange),
        'x',
        zoomRange,
      ),
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
