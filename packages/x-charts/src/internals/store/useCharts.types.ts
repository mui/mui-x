import * as React from 'react';
import { ChartAnyPluginSignature, ChartPublicAPI } from '../plugins/models';

export interface UseChartBaseProps<TSignatures extends readonly ChartAnyPluginSignature[]> {
  apiRef: React.RefObject<ChartPublicAPI<TSignatures> | undefined> | undefined;
}
