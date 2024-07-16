import { ZoomProviderProps } from '../context/ZoomProvider';
import type { ChartContainerProProps } from './ChartContainerPro';

export const useChartContainerProProps = (props: ChartContainerProProps) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const zoomProviderProps: Omit<ZoomProviderProps, 'children'> = {
    zoom,
    onZoomChange,
  };

  return {
    zoomProviderProps,
    baseProps,
  };
};
