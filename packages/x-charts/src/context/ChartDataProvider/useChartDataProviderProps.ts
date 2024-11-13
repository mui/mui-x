'use client';
import * as React from 'react';
import type { DrawingProviderProps } from '../DrawingProvider';
import type { CartesianProviderProps } from '../CartesianProvider';
import type { SeriesProviderProps } from '../SeriesProvider';
import type { ZAxisContextProviderProps } from '../ZAxisContextProvider';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { HighlightedProviderProps } from '../HighlightedProvider';
import { useDefaultizeAxis } from './useDefaultizeAxis';
import { PluginProviderProps } from '../PluginProvider';
import { AnimationProviderProps } from '../AnimationProvider';
import { SizeProviderProps } from '../SizeProvider';

export const useChartDataProviderProps = (props: ChartDataProviderProps) => {
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
    highlightedItem,
    onHighlightChange,
    plugins,
    children,
    skipAnimation,
    resolveSizeBeforeRender,
  } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);

  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis, dataset);

  const drawingProviderProps: Omit<DrawingProviderProps, 'children'> = {
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

  const sizeProviderProps: Omit<SizeProviderProps, 'children'> = {
    width,
    height,
    resolveSizeBeforeRender,
  };

  return {
    children,
    drawingProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    pluginProviderProps,
    animationProviderProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
    sizeProviderProps,
  };
};
