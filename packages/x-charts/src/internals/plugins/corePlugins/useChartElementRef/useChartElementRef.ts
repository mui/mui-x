'use client';
import * as React from 'react';
import type { ChartPlugin } from '../../models';
import type { UseChartElementRefSignature } from './useChartElementRef.types';

export const useChartElementRef: ChartPlugin<UseChartElementRefSignature> = () => {
  const chartsLayerContainerRef = React.useRef<HTMLDivElement>(null);
  const chartRootRef = React.useRef<Element>(null);
  const chartsAccessibilityProxyRef = React.useRef<HTMLDivElement>(null);

  return {
    instance: {
      chartsLayerContainerRef,
      chartRootRef,
      chartsAccessibilityProxyRef,
    },
  };
};

useChartElementRef.params = {};
