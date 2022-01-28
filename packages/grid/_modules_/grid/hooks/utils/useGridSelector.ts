import { GridApiRef } from '../../models/api/gridApiRef';
import { GridApiCommon } from '../../models/api/gridApi';
import { OutputSelector } from '../../utils/createSelector';

let warnedOnceStateNotInitialized = false;

function isOutputSelector<S, T>(selector: any): selector is OutputSelector<S, T> {
  return selector.cache;
}

export const useGridSelector = <S, GridApi extends GridApiCommon & { state: S }, T>(
  apiRef: GridApiRef<GridApi>,
  selector: ((state: S) => T) | OutputSelector<S, T>,
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

  if (isOutputSelector<S, T>(selector)) {
    return selector(apiRef);
  }

  return selector(apiRef.current.state);
};
