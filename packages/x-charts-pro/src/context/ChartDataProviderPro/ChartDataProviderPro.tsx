'use client';
import * as React from 'react';
import {
  ChartDataProviderProps,
  PluginProvider,
  SeriesProvider,
  AnimationProvider,
  ChartProvider,
} from '@mui/x-charts/internals';
import { HighlightedProvider, ZAxisContextProvider } from '@mui/x-charts/context';
import { useLicenseVerifier } from '@mui/x-license/useLicenseVerifier';
import { getReleaseInfo } from '../../internals/utils/releaseInfo';
import { CartesianProviderPro } from '../CartesianProviderPro';
import { ZoomProps, ZoomProvider } from '../ZoomProvider';
import { useChartContainerProProps } from './useChartDataProviderProProps';

const releaseInfo = getReleaseInfo();

export interface ChartDataProviderProProps extends ChartDataProviderProps, ZoomProps {}

function ChartDataProviderPro(props: ChartDataProviderProProps) {
  const {
    zoomProviderProps,
    seriesProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    cartesianProviderProps,
    pluginProviderProps,
    animationProviderProps,
    chartProviderProps,
    children,
  } = useChartContainerProProps(props);

  useLicenseVerifier('x-charts-pro', releaseInfo);

  return (
    <ChartProvider {...chartProviderProps}>
      <AnimationProvider {...animationProviderProps}>
        <PluginProvider {...pluginProviderProps}>
          <ZoomProvider {...zoomProviderProps}>
            <SeriesProvider {...seriesProviderProps}>
              <CartesianProviderPro {...cartesianProviderProps}>
                <ZAxisContextProvider {...zAxisContextProps}>
                  <HighlightedProvider {...highlightedProviderProps}>
                    {children}
                  </HighlightedProvider>
                </ZAxisContextProvider>
              </CartesianProviderPro>
            </SeriesProvider>
          </ZoomProvider>
        </PluginProvider>
      </AnimationProvider>
    </ChartProvider>
  );
}

export { ChartDataProviderPro };
