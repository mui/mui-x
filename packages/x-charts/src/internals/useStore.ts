import * as React from 'react';
import { ChartsContext } from '../context/InteractionProvider';

export function useStore() {
  const charts = React.useContext(ChartsContext);

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
