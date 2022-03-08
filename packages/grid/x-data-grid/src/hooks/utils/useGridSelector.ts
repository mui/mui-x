import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { OutputSelector } from '../../utils/createSelector';
import { buildWarning } from '../../utils/warning';

function isOutputSelector<Api extends GridApiCommon, T>(
  selector: any,
): selector is OutputSelector<Api['state'], T> {
  return selector.cache;
}

const stateNotInitializedWarning = buildWarning([
  'MUI: `useGridSelector` has been called before the initialization of the state.',
  'This hook can only be used inside the context of the grid.',
]);

export const useGridSelector = <Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!apiRef.current.state) {
      stateNotInitializedWarning();
    }
  }

  if (isOutputSelector<Api, T>(selector)) {
    return selector(apiRef);
  }

  return selector(apiRef.current.state);
};
