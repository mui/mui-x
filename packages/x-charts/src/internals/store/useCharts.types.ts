import type * as React from 'react';
import type { ChartAnyPluginSignature } from '../plugins/models/plugin';
import type { ChartPublicAPI } from '../plugins/models/chart';
import type { ChartSeriesConfig } from '../plugins/corePlugins/useChartSeriesConfig';

export interface UseChartBaseProps<TSignatures extends readonly ChartAnyPluginSignature[]> {
  apiRef?: React.RefObject<ChartPublicAPI<TSignatures> | undefined>;
  /**
   * The configuration for the series types.
   * This is used to define how each series type should be processed, colored, and displayed.
   */
  seriesConfig?: ChartSeriesConfig<any>;
}
