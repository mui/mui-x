'use client';
import * as React from 'react';
import {
  ChartDataProviderProps,
  AnimationProvider,
  ChartProvider,
  UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';
import { HighlightedProvider, ZAxisContextProvider } from '@mui/x-charts/context';
import { useLicenseVerifier } from '@mui/x-license/useLicenseVerifier';
import { getReleaseInfo } from '../../internals/utils/releaseInfo';
import { ZoomProps } from '../ZoomProvider';
import { useChartContainerProProps } from './useChartDataProviderProProps';
import { UseChartProZoomSignature } from '../../internals/plugins/useChartProZoom/useChartProZoom.types';

const releaseInfo = getReleaseInfo();

export interface ChartDataProviderProProps
  extends ChartDataProviderProps<[UseChartCartesianAxisSignature, UseChartProZoomSignature]>,
    ZoomProps {}

function ChartDataProviderPro(props: ChartDataProviderProProps) {
  const {
    zAxisContextProps,
    highlightedProviderProps,
    animationProviderProps,
    chartProviderProps,
    children,
  } = useChartContainerProProps(props);

  useLicenseVerifier('x-charts-pro', releaseInfo);

  return (
    <ChartProvider {...chartProviderProps}>
      <AnimationProvider {...animationProviderProps}>
        <ZAxisContextProvider {...zAxisContextProps}>
          <HighlightedProvider {...highlightedProviderProps}>{children}</HighlightedProvider>
        </ZAxisContextProvider>
      </AnimationProvider>
    </ChartProvider>
  );
}

export { ChartDataProviderPro };
