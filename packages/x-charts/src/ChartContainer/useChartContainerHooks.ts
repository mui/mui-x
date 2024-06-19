import useForkRef from '@mui/utils/useForkRef';
import * as React from 'react';
import { usePluginsMerge } from './usePluginsMerge';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ChartsPluginType } from '../models';
import { ChartSeriesType } from '../models/seriesType/config';

export const useChartContainerHooks = (
  ref: React.ForwardedRef<unknown> | null,
  plugins?: ChartsPluginType<ChartSeriesType>[],
) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const handleRef = useForkRef(ref, svgRef);

  const { xExtremumGetters, yExtremumGetters, seriesFormatters, colorProcessors } =
    usePluginsMerge(plugins);
  useReducedMotion(); // a11y reduce motion (see: https://react-spring.dev/docs/utilities/use-reduced-motion)

  return {
    svgRef,
    handleRef,
    xExtremumGetters,
    yExtremumGetters,
    seriesFormatters,
    colorProcessors,
  };
};
