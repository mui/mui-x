'use client';
import * as React from 'react';
import type { DrawingAreaProviderProps } from '../DrawingAreaProvider';
import type { CartesianProviderProps } from '../CartesianProvider';
import type { SeriesProviderProps } from '../SeriesProvider';
import type { ZAxisContextProviderProps } from '../ZAxisContextProvider';
import type { ChartDataProviderProps } from './ChartDataProvider';
import { HighlightedProviderProps } from '..';
import { ChartsSurfaceProps } from '../../ChartsSurface';
import { useDefaultizeAxis } from './useDefaultizeAxis';
import { PluginProviderProps } from '../PluginProvider';
import { AnimationProviderProps } from '../AnimationProvider';
import { SvgRefProviderProps } from '../SvgRefProvider';

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

  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis, dataset);

  const svgRefProviderProps: Omit<SvgRefProviderProps, 'children'> = {
    svgRef: ref,
  };

  const drawingAreaProviderProps: Omit<DrawingAreaProviderProps, 'children'> = {
    width,
    height,
    margin,
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

  const chartsSurfaceProps: ChartsSurfaceProps = {
    ...other,
    width,
    height,
    sx,
    title,
    desc,
    disableAxisListener,
  };

  return {
    children,
    drawingAreaProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    pluginProviderProps,
    animationProviderProps,
    svgRefProviderProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
  };
};
