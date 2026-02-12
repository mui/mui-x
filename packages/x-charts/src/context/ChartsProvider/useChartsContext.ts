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
      [
        'MUI X Charts: Could not find the Charts context.',
        'It looks like you rendered your component outside of a ChartsDataProvider.',
        'This can also happen if you are bundling multiple versions of the library.',
      ].join('\n'),
    );
  }

  return context;
};
