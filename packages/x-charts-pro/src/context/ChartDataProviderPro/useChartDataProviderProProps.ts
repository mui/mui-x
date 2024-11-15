'use client';
import { useChartDataProviderProps } from '@mui/x-charts/internals';
import { ZoomProviderProps } from '../ZoomProvider';
import type { ChartDataProviderProProps } from './ChartDataProviderPro';

export const useChartContainerProProps = (props: ChartDataProviderProProps) => {
  const { zoom, onZoomChange, ...baseProps } = props;

  const {
    children,
    drawingAreaProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    sizeProviderProps,
    pluginProviderProps,
    animationProviderProps,
    xAxis,
    yAxis,
  } = useChartDataProviderProps(baseProps);

  const zoomProviderProps: Omit<ZoomProviderProps, 'children'> = {
    zoom,
    onZoomChange,
    xAxis,
    yAxis,
  };

  return {
    zoomProviderProps,
    children,
    drawingAreaProviderProps,
    pluginProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    sizeProviderProps,
    animationProviderProps,
  };
};
