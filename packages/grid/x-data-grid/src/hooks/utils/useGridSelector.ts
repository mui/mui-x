import * as React from 'react';
import { GridApiCommon } from '../../models/api/gridApiCommon';
import { OutputSelector } from '../../utils/createSelector';
import { buildWarning } from '../../utils/warning';
import { fastShallowCompare } from '../../utils/fastShallowCompare';

const stateNotInitializedWarning = buildWarning([
  'MUI: `useGridSelector` has been called before the initialization of the state.',
  'This hook can only be used inside the context of the grid.',
]);

const EMPTY = [] as unknown[];

function isOutputSelector<Api extends GridApiCommon, T>(
  selector: any,
): selector is OutputSelector<Api['state'], T> {
  return selector.acceptsApiRef;
}

export function applySelector<Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>
) {
  if (isOutputSelector<Api, T>(selector)) {
    return selector(apiRef);
  }
  return selector(apiRef.current.state);
}


export const defaultCompare = Object.is; // XXX: Do we need to polyfill?
export const shallowCompare = fastShallowCompare;

export const useGridSelector = <Api extends GridApiCommon, T>(
  apiRef: React.MutableRefObject<Api>,
  selector: ((state: Api['state']) => T) | OutputSelector<Api['state'], T>,
  equals: ((a: T, b: T) => boolean) = defaultCompare
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!apiRef.current.state) {
      stateNotInitializedWarning();
    }
  }

  const selectorRef = React.useRef<typeof selector>();
  const [state, setState] = React.useState<T>(
    (selectorRef.current ? null : applySelector(apiRef, selector)) as T
  );
  const stateRef = React.useRef<T>(state);

  stateRef.current = state;
  selectorRef.current = selector;

  React.useEffect(() => {
    return apiRef.current.store.subscribe(() => {
      const state = stateRef.current;
      const newState = applySelector(apiRef, selectorRef.current!)
      if (!equals(state, newState)) {
        stateRef.current = newState;
        setState(newState);
      }
    })
  }, EMPTY);

  return state;
};
