import { GridApiRef } from '../../models/api/gridApiRef';
import { GridState } from '../../models/gridState';

let warnedOnceStateNotInitialized = false;

export const useGridSelector = <T>(apiRef: GridApiRef, selector: (state: GridState) => T) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceStateNotInitialized && !apiRef.current.state) {
      warnedOnceStateNotInitialized = true;
      console.warn(
        [
          'MUI: `useGridSelector` has been called before the initialization of the state.',
          'This hook can only be used inside the context of the grid.',
        ].join('\n'),
      );
    }
  }

  return selector(apiRef.current.state);
};
