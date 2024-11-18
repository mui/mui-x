import * as React from 'react';
import { ChartStore } from './plugins/utils/ChartStore';
import { ChartState } from './plugins/models';

let globalId = 0;

export function useCharts() {
  const storeRef = React.useRef<ChartStore | null>(null);
  if (storeRef.current == null) {
    // eslint-disable-next-line react-compiler/react-compiler
    globalId += 1;
    const initialState: ChartState = {
      interaction: {
        item: null,
        axis: { x: null, y: null },
      },
      cacheKey: { id: globalId },
    };
    storeRef.current = new ChartStore(initialState);
  }

  const contextValue = React.useMemo(() => ({ store: storeRef.current as ChartStore }), []);

  return { contextValue };
}
