import type { DrawingProviderProps } from '../context/DrawingProvider';
import type { ColorProviderProps } from '../context/ColorProvider';
import type { CartesianContextProviderProps } from '../context/CartesianProvider';
import type { SeriesProviderProps } from '../context/SeriesProvider';
import type { ZAxisContextProviderProps } from '../context/ZAxisContextProvider';
import type { ChartContainerProps } from './ChartContainer';
import { useChartContainerHooks } from './useChartContainerHooks';
import { HighlightedProviderProps } from '../context';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { useDefaultizeAxis } from './useDefaultizeAxis';

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

  const {
    svgRef,
    chartSurfaceRef,
    xExtremumGetters,
    yExtremumGetters,
    seriesFormatters,
    colorProcessors,
  } = useChartContainerHooks(ref, plugins);

  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis);

  const drawingProviderProps: Omit<DrawingProviderProps, 'children'> = {
    width,
    height,
    margin,
    svgRef,
  };

  const colorProviderProps: Omit<ColorProviderProps, 'children'> = {
    colorProcessors,
  };

  const seriesProviderProps: Omit<SeriesProviderProps, 'children'> = {
    series,
    colors,
    dataset,
    seriesFormatters,
  };

  const cartesianContextProps: Omit<CartesianContextProviderProps, 'children'> = {
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
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
    colorProviderProps,
    seriesProviderProps,
    cartesianContextProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
  };
};
