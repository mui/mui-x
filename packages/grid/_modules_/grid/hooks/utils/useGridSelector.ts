import { GridApiRef } from '../../models/api/gridApiRef';
import { OutputSelector } from '../../utils/createSelector';
import { GridState } from '../../models/gridState';

let warnedOnceStateNotInitialized = false;

function isOutputSelector<T>(selector: any): selector is OutputSelector<T> {
  return selector.cache;
}

export const useGridSelector = <T>(
  apiRef: GridApiRef,
  selector: ((state: GridState) => T) | OutputSelector<T>,
) => {
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

  if (isOutputSelector(selector)) {
    return selector(apiRef);
  }

  return selector(apiRef.current.state);
};
