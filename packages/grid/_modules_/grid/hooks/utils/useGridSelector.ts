import { GridApiRef } from '../../models/api/gridApiRef';
import { useGridState } from './useGridState';
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

  const [state] = useGridState(apiRef);
  return selector(state);
};
