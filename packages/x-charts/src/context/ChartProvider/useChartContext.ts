'use client';
import * as React from 'react';
import { ChartAnyPluginSignature } from '../../internals/plugins/models';
import { ChartContext } from './ChartContext';
import { ChartContextValue } from './ChartProvider.types';

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
      [
        'MUI X: Could not find the Chart context.',
        'It looks like you rendered your component outside of a ChartDataProvider.',
        'This can also happen if you are bundling multiple versions of the library.',
      ].join('\n'),
    );
  }

  return context;
};
