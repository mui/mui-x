import type * as React from 'react';
import type { ChartPluginSignature } from '../../models';

export interface UseChartElementRefInstance {
  /**
   * Reference to the chart surface element.
   */
  chartsLayerContainerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Reference to the chart root element.
   */
  chartRootRef: React.RefObject<Element | null>;
  /**
   * Reference to the root of the accessibility proxy, the element owning the chart tab stop.
   * It is `null` when keyboard navigation is disabled.
   */
  chartsAccessibilityProxyRef: React.RefObject<HTMLDivElement | null>;
}

export type UseChartElementRefSignature = ChartPluginSignature<{
  instance: UseChartElementRefInstance;
}>;
