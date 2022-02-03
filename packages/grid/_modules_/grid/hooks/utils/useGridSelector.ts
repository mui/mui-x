import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { OutputSelector } from '../../utils/createSelector';

let warnedOnceStateNotInitialized = false;

function isOutputSelector<Api extends GridApiCommon, T>(
  selector: any,
): selector is OutputSelector<Api['state'], T> {
  return selector.cache;
}

export const useGridSelector = <Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
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

  if (isOutputSelector<Api, T>(selector)) {
    return selector(apiRef);
  }

  return selector(apiRef.current.state);
};
