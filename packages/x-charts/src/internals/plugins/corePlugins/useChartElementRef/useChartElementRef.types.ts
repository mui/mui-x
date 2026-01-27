import type * as React from 'react';
import { type ChartPluginSignature } from '../../models';

export interface UseChartElementRefInstance {
  /**
   * Reference to the main svg element.
   */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /**
   * Reference to the chart root element.
   */
  chartRootRef: React.RefObject<Element | null>;
}

export type UseChartElementRefSignature = ChartPluginSignature<{
  instance: UseChartElementRefInstance;
}>;
