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
    colorProviderProps,
    seriesProviderProps,
    cartesianContextProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
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
    colorProviderProps,
    seriesProviderProps,
    cartesianContextProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
  };
};
