import type { DrawingProviderProps } from '../context/DrawingProvider';
import type { ColorProviderProps } from '../context/ColorProvider';
import type { CartesianContextProviderProps } from '../context/CartesianProvider';
import type { SeriesContextProviderProps } from '../context/SeriesContextProvider';
import type { ZAxisContextProviderProps } from '../context/ZAxisContextProvider';
import type { ChartContainerProps } from './ChartContainer';

import { useChartContainerHooks } from './useChartContainerHooks';
import { HighlightedProviderProps } from '../context';
import { ChartsSurfaceProps } from '../ChartsSurface';

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
    ...rest
  } = props;

  const {
    svgRef,
    chartSurfaceRef,
    xExtremumGetters,
    yExtremumGetters,
    seriesFormatters,
    colorProcessors,
  } = useChartContainerHooks(ref, plugins);

  const drawingProviderProps: Omit<DrawingProviderProps, 'children'> = {
    width,
    height,
    margin,
    svgRef,
  };

  const colorProviderProps: Omit<ColorProviderProps, 'children'> = {
    colorProcessors,
  };

  const seriesContextProps: Omit<SeriesContextProviderProps, 'children'> = {
    series,
    colors,
    dataset,
    seriesFormatters,
  };

  const cartesianContextProps: Omit<CartesianContextProviderProps, 'children'> = {
    xAxis,
    yAxis,
    dataset,
    xExtremumGetters,
    yExtremumGetters,
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
    ...rest,
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
    colorProviderProps,
    seriesContextProps,
    cartesianContextProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
  };
};
