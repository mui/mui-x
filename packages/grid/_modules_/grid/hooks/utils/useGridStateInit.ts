import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState, GridPartialState } from '../../models/gridState';

export const useGridStateInit = (
  apiRef: GridApiRef,
  callback: (state: GridPartialState) => GridPartialState,
) => {
  const isInitialized = React.useRef(false);

  if (!isInitialized.current) {
    apiRef.current.state = callback(apiRef.current.state) as GridState;
    isInitialized.current = true;
  }
};
