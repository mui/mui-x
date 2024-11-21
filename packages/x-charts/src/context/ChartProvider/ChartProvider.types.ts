import * as React from 'react';
import {
  ChartAnyPluginSignature,
  ChartInstance,
  ChartPublicAPI,
} from '../../internals/plugins/models';
import { ChartStore } from '../../internals/plugins/utils/ChartStore';

export type ChartContextValue<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> = {
  instance: ChartInstance<TSignatures, TOptionalSignatures>;
  publicAPI: ChartPublicAPI<TSignatures, TOptionalSignatures>;
  store: ChartStore<TSignatures>;
  svgRef: React.RefObject<SVGSVGElement>;
};

export interface ChartProviderProps<TSignatures extends readonly ChartAnyPluginSignature[]> {
  value: ChartContextValue<TSignatures>;
  children: React.ReactNode;
}
