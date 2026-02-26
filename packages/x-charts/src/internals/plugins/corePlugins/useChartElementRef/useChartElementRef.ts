'use client';
import * as React from 'react';
import { type ChartPlugin } from '../../models';
import { type UseChartElementRefSignature } from './useChartElementRef.types';

export const useChartElementRef: ChartPlugin<UseChartElementRefSignature> = () => {
  const svgRef = React.useRef<HTMLDivElement>(null);
  const chartRootRef = React.useRef<Element>(null);

  return {
    instance: {
      svgRef,
      chartRootRef,
    },
  };
};

useChartElementRef.params = {};
