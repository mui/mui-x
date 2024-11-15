import * as React from 'react';
import { ChartsContext } from '../context/InteractionProvider';
import { ChartStore } from './plugins/utils/ChartStore';

export function useStore(skipError?: boolean): ChartStore {
  const charts = React.useContext(ChartsContext);

  if (skipError) {
    // TODO: Remove once store is used by all charts.
    // This line is only for `useAxisEvents` which is in the surface of the Gauge.
    // But the Gauge don't have store yet because it does not need the interaction provider.
    // Will be fixed when every thing move to the store since every component will have access to it.
    // @ts-ignore
    return charts?.store;
  }
  if (!charts) {
    throw new Error(
      [
        'MUI X: Could not find the charts context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return charts.store;
}
