'use client';
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import type { DrawingProviderProps } from '../DrawingProvider';
import type { CartesianProviderProps } from '../CartesianProvider';
import type { SeriesProviderProps } from '../SeriesProvider';
import type { ZAxisContextProviderProps } from '../ZAxisContextProvider';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { HighlightedProviderProps } from '../HighlightedProvider';
import { useDefaultizeAxis } from './useDefaultizeAxis';
import { PluginProviderProps } from '../PluginProvider';
import { AnimationProviderProps } from '../AnimationProvider';
import { SurfacePropsProviderProps } from '../SurfacePropsProvider';

export const useChartDataProviderProps = (
  props: ChartDataProviderProps,
  ref: React.Ref<SVGSVGElement>,
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
    skipAnimation,
    ...other
  } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const chartSurfaceRef = useForkRef(ref, svgRef);

  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis, dataset);

  const drawingProviderProps: Omit<DrawingProviderProps, 'children'> = {
    width,
    height,
    margin,
    svgRef,
  };

  const animationProviderProps: Omit<AnimationProviderProps, 'children'> = {
    skipAnimation,
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

  const surfacePropsProviderProps: Omit<SurfacePropsProviderProps, 'children'> & {
    ref: any;
  } = {
    ...other,
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
    surfacePropsProviderProps,
    pluginProviderProps,
    animationProviderProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
  };
};
