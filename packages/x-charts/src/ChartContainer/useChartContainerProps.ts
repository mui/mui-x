import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import type { DrawingProviderProps } from '../context/DrawingProvider';
import type { CartesianProviderProps } from '../context/CartesianProvider';
import type { SeriesProviderProps } from '../context/SeriesProvider';
import type { ZAxisContextProviderProps } from '../context/ZAxisContextProvider';
import type { ChartContainerProps } from './ChartContainer';
import { HighlightedProviderProps } from '../context';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { useDefaultizeAxis } from './useDefaultizeAxis';
import { PluginProviderProps } from '../context/PluginProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const useChartContainerProps = (
  props: ChartContainerProps,
  ref: React.ForwardedRef<unknown>,
) => {
  const {
    width,
    height,
    series,
    margin,
    xAxis,
    yAxis,
    zAxis,
    colors,
    dataset,
    sx,
    title,
    desc,
    disableAxisListener,
    highlightedItem,
    onHighlightChange,
    plugins,
    children,
    ...other
  } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const chartSurfaceRef = useForkRef(ref, svgRef);

  useReducedMotion(); // a11y reduce motion (see: https://react-spring.dev/docs/utilities/use-reduced-motion)

  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis, dataset);

  const drawingProviderProps: Omit<DrawingProviderProps, 'children'> = {
    width,
    height,
    margin,
    svgRef,
  };

  const pluginProviderProps: Omit<PluginProviderProps, 'children'> = {
    plugins,
  };

  const seriesProviderProps: Omit<SeriesProviderProps, 'children'> = {
    series,
    colors,
    dataset,
  };

  const cartesianProviderProps: Omit<CartesianProviderProps, 'children'> = {
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
    dataset,
  };

  const zAxisContextProps: Omit<ZAxisContextProviderProps, 'children'> = {
    zAxis,
    dataset,
  };

  const highlightedProviderProps: Omit<HighlightedProviderProps, 'children'> = {
    highlightedItem,
    onHighlightChange,
  };

  const chartsSurfaceProps: ChartsSurfaceProps & { ref: any } = {
    ...other,
    width,
    height,
    ref: chartSurfaceRef,
    sx,
    title,
    desc,
    disableAxisListener,
  };

  return {
    children,
    drawingProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    pluginProviderProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
  };
};
