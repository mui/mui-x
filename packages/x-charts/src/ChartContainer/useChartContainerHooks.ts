import useForkRef from '@mui/utils/useForkRef';
import * as React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartsPlugin } from '../context/PluginProvider';
import { mergePlugins } from '../context/PluginProvider/mergePlugins';

export const useChartContainerHooks = (
  ref: React.ForwardedRef<unknown> | null,
  plugins?: ChartsPlugin<ChartSeriesType>[],
) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const chartSurfaceRef = useForkRef(ref, svgRef);

  const { xExtremumGetters, yExtremumGetters, seriesFormatters, colorProcessors } =
    mergePlugins(plugins);
  useReducedMotion(); // a11y reduce motion (see: https://react-spring.dev/docs/utilities/use-reduced-motion)

  return {
    svgRef,
    chartSurfaceRef,
    xExtremumGetters,
    yExtremumGetters,
    seriesFormatters,
    colorProcessors,
  };
};
