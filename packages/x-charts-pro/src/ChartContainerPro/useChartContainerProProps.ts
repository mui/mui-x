import { useChartContainerProps } from '@mui/x-charts/internals';
import { ZoomProviderProps } from '../context/ZoomProvider';
import type { ChartContainerProProps } from './ChartContainerPro';

export const useChartContainerProProps = (
  props: ChartContainerProProps,
  ref: React.ForwardedRef<unknown>,
) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const {
    children,
    drawingProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    pluginProviderProps,
    xAxis,
    yAxis,
  } = useChartContainerProps(baseProps, ref);

  const zoomProviderProps: Omit<ZoomProviderProps, 'children'> = {
    zoom,
    onZoomChange,
    xAxis,
    yAxis,
  };

  return {
    zoomProviderProps,
    children,
    drawingProviderProps,
    pluginProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
  };
};
