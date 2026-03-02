import type * as React from 'react';
import { type ChartPluginSignature } from '../../models';

export interface UseChartElementRefInstance {
  /**
   * Reference to the chart surface element.
   */
  chartsLayerContainerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Reference to the chart root element.
   */
  chartRootRef: React.RefObject<Element | null>;
}

export type UseChartElementRefSignature = ChartPluginSignature<{
  instance: UseChartElementRefInstance;
}>;
