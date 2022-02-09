import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState } from '../../models/gridState';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type GridStateInitializer<P> = (
  state: DeepPartial<GridState>,
  props: P,
  apiRef: GridApiRef,
) => DeepPartial<GridState>;

export const useGridInitializeState = <P>(
  initializer: GridStateInitializer<P>,
  apiRef: GridApiRef,
  props: P,
) => {
  const isInitialized = React.useRef(false);

  if (!isInitialized.current) {
    apiRef.current.state = initializer(apiRef.current.state, props, apiRef) as GridState;
    isInitialized.current = true;
  }
};
