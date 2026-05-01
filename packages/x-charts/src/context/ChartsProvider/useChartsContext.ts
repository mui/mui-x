'use client';
import * as React from 'react';
import { type ChartAnyPluginSignature } from '../../internals/plugins/models';
import { ChartsContext } from './ChartsContext';
import { type ChartsContextValue } from './ChartsProvider.types';

export const useChartsContext = <
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
>() => {
  const context = React.useContext(ChartsContext) as ChartsContextValue<
    TSignatures,
    TOptionalSignatures
  >;
  if (context == null) {
    throw new Error(
      'MUI X Charts: Could not find the Charts context. ' +
        'This happens when the component is rendered outside of a ChartsDataProvider or ChartsContainer parent component, ' +
        'which means the required context is not available. ' +
        'Wrap your component in a ChartsDataProvider or ChartsContainer. ' +
        'This can also happen if you are bundling multiple versions of the library.',
    );
  }

  return context;
};
