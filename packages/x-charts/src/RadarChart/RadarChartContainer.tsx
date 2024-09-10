import * as React from 'react';

import { DrawingProvider, DrawingProviderProps } from '../context/DrawingProvider';
import { SeriesProvider, SeriesProviderProps } from '../context/SeriesProvider';
import { InteractionProvider } from '../context/InteractionProvider';
import { ChartsSurface, ChartsSurfaceProps } from '../ChartsSurface';
import { RadialProvider, RadialProviderProps } from '../context/RadialProvider';
import { ChartsAxesGradients } from '../internals/components/ChartsAxesGradients';
import {
  HighlightedProvider,
  HighlightedProviderProps,
  ZAxisContextProvider,
  ZAxisContextProviderProps,
} from '../context';
import { PluginProvider, PluginProviderProps } from '../context/PluginProvider';
import { useRadarChartContainerProps } from './useRadarChartContainerProps';

interface MetricConfig {
  /**
   * The name of the metric.
   */
  name: string;
  /**
   * The minimal value of the domain.
   * @default 0
   */
  min?: number;
  /**
   * The maximal value of the domain.
   * If not provided, it gets computed to display the entire chart data.
   */
  max?: number;
}
interface RadarConfig {
  /**
   * The different metrics shown by radar.
   */
  metrics: string[] | MetricConfig[];
  /**
   * The angle of the first axis (in deg)
   * @default 0
   */
  startAngle?: number;
}
export type RadarChartContainerProps = Omit<
  ChartsSurfaceProps &
    Omit<SeriesProviderProps, 'seriesFormatters'> &
    Omit<DrawingProviderProps, 'svgRef'> &
    Pick<RadialProviderProps, 'dataset'> &
    ZAxisContextProviderProps &
    HighlightedProviderProps &
    PluginProviderProps,
  'children'
> & {
  radar: RadarConfig;
  children?: React.ReactNode;
};

export const RadarChartContainer = React.forwardRef(function RadarChartContainer(
  props: RadarChartContainerProps,
  ref,
) {
  const {
    children,
    drawingProviderProps,
    seriesProviderProps,
    radialProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    pluginProviderProps,
  } = useRadarChartContainerProps(props, ref);
  
  return (
    <DrawingProvider {...drawingProviderProps}>
      <PluginProvider {...pluginProviderProps}>
        <SeriesProvider {...seriesProviderProps}>
          <RadialProvider {...radialProviderProps}>
            <ZAxisContextProvider {...zAxisContextProps}>
              <InteractionProvider>
                <HighlightedProvider {...highlightedProviderProps}>
                  <ChartsSurface {...chartsSurfaceProps}>
                    <ChartsAxesGradients />
                    {children}
                  </ChartsSurface>
                </HighlightedProvider>
              </InteractionProvider>
            </ZAxisContextProvider>
          </RadialProvider>
        </SeriesProvider>
      </PluginProvider>
    </DrawingProvider>
  );
});
