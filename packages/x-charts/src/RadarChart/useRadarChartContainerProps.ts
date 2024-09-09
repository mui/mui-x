import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import type { DrawingProviderProps } from '../context/DrawingProvider';
import type { RadialProviderProps } from '../context/RadialProvider';
import type { SeriesProviderProps } from '../context/SeriesProvider';
import type { ZAxisContextProviderProps } from '../context/ZAxisContextProvider';
import type { RadarChartContainerProps } from './RadarChartContainer';
import { HighlightedProviderProps } from '../context';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { PluginProviderProps } from '../context/PluginProvider';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { plugin } from './plugin';

export const useRadarChartContainerProps = (
  props: RadarChartContainerProps,
  ref: React.ForwardedRef<unknown>,
) => {
  const {
    width,
    height,
    series,
    margin,
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
    radar,
    children,
    ...other
  } = props;
  const svgRef = React.useRef<SVGSVGElement>(null);
  const chartSurfaceRef = useForkRef(ref, svgRef);

  const metricNames = radar.metrics.map((m) => (typeof m === 'string' ? m : m.name));
  const startAngle = radar.startAngle ?? 0;
  const endAngle = startAngle + ((metricNames.length - 1) * 360) / metricNames.length;

  useReducedMotion(); // a11y reduce motion (see: https://react-spring.dev/docs/utilities/use-reduced-motion)

  const drawingProviderProps: Omit<DrawingProviderProps, 'children'> = {
    width,
    height,
    margin,
    svgRef,
  };

  const pluginProviderProps: Omit<PluginProviderProps, 'children'> = {
    plugins: [plugin],
  };

  const seriesProviderProps: Omit<SeriesProviderProps, 'children'> = {
    series,
    colors,
    dataset,
  };

  const radialProviderProps: Omit<RadialProviderProps, 'children'> = {
    rotationAxis: [
      {
        id: DEFAULT_X_AXIS_KEY,
        scaleType: 'point',
        data: metricNames,
        min: (Math.PI * startAngle) / 180,
        max: (Math.PI * endAngle) / 180,
      },
    ],
    radiusAxis: [
      {
        id: DEFAULT_Y_AXIS_KEY,
        scaleType: 'linear',
        min: 0,
        max: 100,
      },
    ],
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
    radialProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    pluginProviderProps,
  };
};
