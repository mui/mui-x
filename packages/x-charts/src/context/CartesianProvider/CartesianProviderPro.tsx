import * as React from 'react';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { CartesianContext } from './CartesianContext';
import { normalizeAxis } from './normalizeAxis';
import { computeValue } from './computeValue';
import { ExtremumGettersConfig } from '../../models';
import { useZoom } from '../ZoomProvider/useZoom';
import { CartesianContextProviderProps } from './CartesianProvider';

function CartesianContextProviderPro(props: CartesianContextProviderProps) {
  const prevContext = React.useContext(CartesianContext);

  if (prevContext.isInitialized) {
    return props.children;
  }

  return <CartesianContextProviderReal {...props} />;
}

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
        // @ts-ignore
        const data = value(...getterProp);
        const result = calculateZoom(data, zoom);
        return result;
      },
    ]),
  );
};

function CartesianContextProviderReal(props: CartesianContextProviderProps) {
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

  const value = React.useMemo(
    () =>
      computeValue(
        drawingArea,
        formattedSeries,
        xAxis,
        yAxis,
        zoomExtremumGetter(xExtremumGetters, zoomRange),
        yExtremumGetters,
      ),
    [drawingArea, formattedSeries, xAxis, xExtremumGetters, yAxis, yExtremumGetters, zoomRange],
  );

  return <CartesianContext.Provider value={value}>{children}</CartesianContext.Provider>;
}

export { CartesianContextProviderPro };
