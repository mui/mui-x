import type * as React from 'react';
import { type ChartAnyPluginSignature, type ChartPublicAPI } from '../plugins/models';

export interface UseChartBaseProps<TSignatures extends readonly ChartAnyPluginSignature[]> {
  apiRef?: React.RefObject<ChartPublicAPI<TSignatures> | undefined>;
}
