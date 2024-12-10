'use client';
import * as React from 'react';
import {
  ChartDataProviderProps,
  DrawingAreaProvider,
  PluginProvider,
  SeriesProvider,
  AnimationProvider,
  SizeProvider,
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
    drawingAreaProviderProps,
    seriesProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    cartesianProviderProps,
    sizeProviderProps,
    pluginProviderProps,
    animationProviderProps,
    children,
  } = useChartContainerProProps(props);

  useLicenseVerifier('x-charts-pro', releaseInfo);

  return (
    <ChartProvider>
      <SizeProvider {...sizeProviderProps}>
        <DrawingAreaProvider {...drawingAreaProviderProps}>
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
        </DrawingAreaProvider>
      </SizeProvider>
    </ChartProvider>
  );
}

export { ChartDataProviderPro };
