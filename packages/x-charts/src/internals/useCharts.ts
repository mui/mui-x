import * as React from 'react';
import { ChartsStore } from './plugins/utils/ChartsStore';
import { ChartsState } from './plugins/models';

let globalId = 0;

export function useCharts() {
  const storeRef = React.useRef<ChartsStore | null>(null);
  if (storeRef.current == null) {
    globalId += 1;
    const initialState: ChartsState = {
      interaction: {
        item: null,
        axis: { x: null, y: null },
      },
      cacheKey: { id: globalId },
    };
    storeRef.current = new ChartsStore(initialState);
  }

  const contextValue = React.useMemo(() => ({ store: storeRef.current as ChartsStore }), []);

  return { contextValue };
}
