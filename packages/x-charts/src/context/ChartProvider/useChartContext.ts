'use client';
import * as React from 'react';
import { type ChartAnyPluginSignature } from '../../internals/plugins/models';
import { ChartContext } from './ChartContext';
import { type ChartContextValue } from './ChartProvider.types';

export const useChartContext = <
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
>() => {
  const context = React.useContext(ChartContext) as ChartContextValue<
    TSignatures,
    TOptionalSignatures
  >;
  if (context == null) {
    throw new Error(
      'MUI X Charts: Could not find the Chart context. ' +
        'This happens when the component is rendered outside of a ChartsDataProvider or ChartsContainer parent component, ' +
        'which means the required context is not available. ' +
        'Wrap your component in a ChartsDataProvider or ChartsContainer. ' +
        'This can also happen if you are bundling multiple versions of the library.',
    );
  }

  return context;
};
