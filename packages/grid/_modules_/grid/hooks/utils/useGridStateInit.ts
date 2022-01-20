import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState } from '../../models/gridState';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const useGridStateInit = (
  apiRef: GridApiRef,
  callback: (state: DeepPartial<GridState>) => DeepPartial<GridState>,
) => {
  const isInitialized = React.useRef(false);

  if (!isInitialized.current) {
    apiRef.current.state = callback(apiRef.current.state) as GridState;
    isInitialized.current = true;
  }
};
